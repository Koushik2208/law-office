// app/api/lawyers/route.ts

import { NextResponse } from "next/server";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { Lawyer } from "@/database";
import { LawyerSchema } from "@/lib/validations";

// GET method: Fetch all lawyers without caseCount
export async function GET() {
  try {
    await dbConnect();
    
    const lawyers = await Lawyer.find();

    return NextResponse.json({ success: true, data: lawyers }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// POST method: Create a new lawyer with validation and error handling
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate incoming data using LawyerSchema
    const validatedData = LawyerSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { email, username } = validatedData.data;

    // Check if a lawyer with the same email or username already exists
    const existingLawyer = await Lawyer.findOne({ email });
    if (existingLawyer) throw new Error("Lawyer already exists");

    const existingLawyername = await Lawyer.findOne({ username });
    if (existingLawyername) throw new Error("Username already exists");

    // Create a new lawyer, caseCount will be managed in the Lawyer model
    const newLawyer = await Lawyer.create(validatedData.data);

    return NextResponse.json({ success: true, data: newLawyer }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
