// app/api/hearings/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Hearing from "@/database/hearing.model";
import Case from "@/database/case.model";
import { Types } from "mongoose";

export async function GET() {
  try {
    await dbConnect();
    const hearings = await Hearing.find()
      .populate("caseId", "title caseNumber clientName");
    return NextResponse.json(hearings);
  } catch (error) {
    console.error("Error fetching hearings:", error);
    return NextResponse.json(
      { error: "Failed to fetch hearings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqBody = await request.json();
    const { caseId, date, description } = reqBody;

    if (!caseId || !date || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!Types.ObjectId.isValid(caseId)) {
      return NextResponse.json(
        { error: "Invalid case ID" },
        { status: 400 }
      );
    }

    // Check if case exists
    const existingCase = await Case.findById(caseId);
    if (!existingCase) {
      return NextResponse.json(
        { error: "Case not found" },
        { status: 404 }
      );
    }

    const newHearing = await Hearing.create({
      caseId: new Types.ObjectId(caseId),
      date,
      description,
    });

    // Update case's hearingIds array
    await Case.findByIdAndUpdate(caseId, {
      $push: { hearingIds: newHearing._id },
    });

    // Populate the case reference in the response
    const populatedHearing = await Hearing.findById(newHearing._id)
      .populate("caseId", "title caseNumber clientName");

    return NextResponse.json(populatedHearing, { status: 201 });
  } catch (error) {
    console.error("Error creating hearing:", error);
    return NextResponse.json(
      { error: "Failed to create hearing" },
      { status: 500 }
    );
  }
}
