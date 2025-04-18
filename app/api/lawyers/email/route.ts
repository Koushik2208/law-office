import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { LawyerSchema } from "@/lib/validations";
import { Lawyer } from "@/database";

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    await dbConnect();

    const validatedData = LawyerSchema.partial().safeParse({ email });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const lawyer = await Lawyer.findOne({ email });
    if (!lawyer) throw new NotFoundError("Lawyer");

    return NextResponse.json(
      {
        success: true,
        data: lawyer,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
