// app/api/cases/[caseId]/route.ts

import { NextResponse, NextRequest } from "next/server";
import { Case, Hearing } from "@/database";
import dbConnect from "@/lib/mongoose";
import mongoose from "mongoose";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ caseId: string }> }
) {
  await dbConnect();

  const { caseId } = await params;

  // Validate if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(caseId)) {
    return NextResponse.json({ error: "Invalid case ID" }, { status: 400 });
  }

  const caseDetails = await Case.findById(caseId).lean();

  if (!caseDetails) {
    return NextResponse.json(
      { error: `Case with ID ${caseId} not found` },
      { status: 404 }
    );
  }

  // Fetch hearings related to this case
  const caseHearings = await Hearing.find({ caseId }).lean();

  return NextResponse.json({ ...caseDetails, hearings: caseHearings });
}
