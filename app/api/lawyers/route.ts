import { NextResponse } from "next/server";
import handleError from "@/lib/handlers/error";
import dbConnect from "@/lib/mongoose";
import { Lawyer } from "@/database";
import { LawyerSchema } from "@/lib/validations";
import { ZodError } from "zod";

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

// POST method: Create multiple new lawyers with validation and error handling
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Expecting an array of lawyer objects
    if (!Array.isArray(body)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Expected an array of lawyer objects in the request body",
          },
        },
        { status: 400 } // Bad Request
      );
    }

    const createdLawyers: Lawyer[] = [];
    const errors: Record<number, ZodError | string> = {};

    for (let i = 0; i < body.length; i++) {
      const lawyerData = body[i];
      const validatedData = LawyerSchema.safeParse(lawyerData);

      if (!validatedData.success) {
        errors[i] = validatedData.error;
        continue; // Skip to the next lawyer if validation fails
      }

      const {
        name,
        email,
        barNumber,
        specialization,
        role = "guest",
      } = validatedData.data;

      // Check if a lawyer with the same email or barNumber already exists
      const existingLawyerEmail = await Lawyer.findOne({ email });
      if (existingLawyerEmail) {
        errors[i] = `Lawyer with email '${email}' already exists`;
        continue;
      }

      const existingLawyerBarNumber = await Lawyer.findOne({ barNumber });
      if (existingLawyerBarNumber) {
        errors[i] = `Lawyer with bar number '${barNumber}' already exists`;
        continue;
      }

      // Create a new lawyer
      const newLawyer = await Lawyer.create({
        name,
        email,
        barNumber,
        specialization,
        role,
      });
      createdLawyers.push(newLawyer);
    }

    if (Object.keys(errors).length > 0 && createdLawyers.length > 0) {
      return NextResponse.json(
        {
          success: true,
          data: { created: createdLawyers, failed: errors },
          message:
            "Some lawyers were created successfully, but others failed validation or already exist.",
        },
        { status: 207 } // Multi-Status
      );
    } else if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Failed to create lawyers", details: errors },
        },
        { status: 400 } // Bad Request
      );
    } else {
      return NextResponse.json(
        { success: true, data: createdLawyers },
        { status: 201 }
      );
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
