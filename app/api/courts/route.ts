// app/api/courts/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { ZodError } from "zod";
import { Court } from "@/database";
import { CreateCourtSchema } from "@/lib/validations";

export async function GET() {
  try {
    await dbConnect();
    const courts = await Court.find();
    return NextResponse.json({ success: true, data: courts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching courts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch courts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // Expecting an array of court objects
    if (!Array.isArray(body)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Expected an array of court objects in the request body"
          }
        },
        { status: 400 }
      );
    }

    const createdCourts = [];
    const errors: Record<number, ZodError | string> = {};

    for (let i = 0; i < body.length; i++) {
      const courtData = body[i];
      const validatedData = CreateCourtSchema.safeParse(courtData);

      if (!validatedData.success) {
        errors[i] = validatedData.error;
        continue;
      }

      const { name, location } = validatedData.data;

      // Check if a court with the same name and location already exists
      const existingCourt = await Court.findOne({ name, location });
      if (existingCourt) {
        errors[i] = `Court with name '${name}' and location '${location}' already exists`;
        continue;
      }

      const newCourt = await Court.create({
        name,
        location
      });
      createdCourts.push(newCourt);
    }

    if (Object.keys(errors).length > 0 && createdCourts.length > 0) {
      return NextResponse.json(
        {
          success: true,
          data: { created: createdCourts, failed: errors },
          message: "Some courts were created successfully, but others failed validation or already exist."
        },
        { status: 207 }
      );
    } else if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Failed to create courts", details: errors }
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { success: true, data: createdCourts },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error creating courts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create courts" },
      { status: 500 }
    );
  }
}
