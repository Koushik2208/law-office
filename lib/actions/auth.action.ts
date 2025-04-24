"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { z } from "zod";

import { signIn } from "@/auth";
import Account from "@/database/account.model";
import Lawyer from "@/database/lawyer.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import { SignUpSchema } from "../validations";
import { SignInSchema } from "../validations";
import { LawyerRole } from "@/types/enums";

export async function signUpWithCredentials(
  params: z.infer<typeof SignUpSchema>
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignUpSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, email, specialization, password, barNumber } =
    validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingLawyer = await Lawyer.findOne({ email }).session(session);

    if (existingLawyer) {
      throw new Error("Lawyer with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [newLawyer] = await Lawyer.create(
      [{ name, email, specialization, barNumber, role: LawyerRole.Guest }], // Set default role to Guest
      {
        session,
      }
    );

    await Account.create(
      [
        {
          userId: newLawyer._id,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    await signIn("credentials", {
      email,
      password,
      redirect: false,
      // role: LawyerRole.Guest,
      // id: newLawyer._id.toString(),
    }); // Include role in signIn

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function signInWithCredentials(
  params: z.infer<typeof SignInSchema>
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignInSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password } = validationResult.params!;

  try {
    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    }).populate("userId");

    if (!existingAccount) throw new NotFoundError("Account");

    const passwordMatch = await bcrypt.compare(
      password,
      existingAccount.password!
    );

    if (!passwordMatch) throw new Error("Password does not match");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lawyer = existingAccount.userId as any;
    if (!lawyer) throw new NotFoundError("Lawyer associated with account");

    await signIn("credentials", {
      email: existingAccount.providerAccountId,
      password,
      redirect: false,
      ...lawyer.toObject(),
    });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
