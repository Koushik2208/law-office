import mongoose from "mongoose";
import { NextResponse } from "next/server";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";
import { Account, Lawyer } from "@/database";

export async function POST(request: Request) {
  const { provider, providerAccountId, user } = await request.json(); 

  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const validatedData = SignInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user, 
    });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { name, email } = user; // Removed image since it's not part of your project

    // Check if the lawyer already exists by email
    let existingLawyer = await Lawyer.findOne({ email }).session(session);

    if (!existingLawyer) {
      [existingLawyer] = await Lawyer.create(
        [{ name, email }], 
        { session }
      );
    } else {
      const updatedData: { name?: string } = {};

      if (existingLawyer.name !== name) updatedData.name = name;

      if (Object.keys(updatedData).length > 0) {
        await Lawyer.updateOne(
          { _id: existingLawyer._id },
          { $set: updatedData }
        ).session(session);
      }
    }

    const existingAccount = await Account.findOne({
      userId: existingLawyer._id,
      provider,
      providerAccountId,
    }).session(session);

    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingLawyer._id,
            provider,
            providerAccountId,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    await session.abortTransaction();
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    // End the session
    session.endSession();
  }
}
