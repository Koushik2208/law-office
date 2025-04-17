// app/api/cases/route.ts

import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import Case from "@/database/case.model";
import { Types } from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const lawyerIdFilter = searchParams.get("lawyerId");
    const courtIdFilter = searchParams.get("courtId");
    const statusFilter = searchParams.get("status");
    const caseNumberFilter = searchParams.get("caseNumber");
    const clientNameFilter = searchParams.get("clientName");

    let query: any = {};

    if (lawyerIdFilter) {
      if (Types.ObjectId.isValid(lawyerIdFilter)) {
        query.lawyerId = new Types.ObjectId(lawyerIdFilter);
      }
    }

    if (courtIdFilter) {
      if (Types.ObjectId.isValid(courtIdFilter)) {
        query.courtId = new Types.ObjectId(courtIdFilter);
      }
    }

    if (statusFilter) {
      if (statusFilter === "pending" || statusFilter === "disposed") {
        query.status = statusFilter;
      }
    }

    if (caseNumberFilter) {
      query.caseNumber = { $regex: caseNumberFilter, $options: "i" };
    }

    if (clientNameFilter) {
      query.clientName = { $regex: clientNameFilter, $options: "i" };
    }

    const cases = await Case.find(query)
      .populate("lawyerId", "name specialization")
      .populate("courtId", "name location");

    return NextResponse.json(cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json(
      { error: "Failed to fetch cases" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqBody = await request.json();
    const { caseNumber, title, clientName, lawyerId, courtId, status = "pending" } = reqBody;

    if (!caseNumber || !title || !clientName || !lawyerId || !courtId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate ObjectIds
    if (!Types.ObjectId.isValid(lawyerId) || !Types.ObjectId.isValid(courtId)) {
      return NextResponse.json(
        { error: "Invalid lawyer or court ID" },
        { status: 400 }
      );
    }

    // Check if case number already exists
    const existingCase = await Case.findOne({ caseNumber });
    if (existingCase) {
      return NextResponse.json(
        { error: "Case number already exists" },
        { status: 400 }
      );
    }

    const newCase = await Case.create({
      caseNumber,
      title,
      clientName,
      lawyerId: new Types.ObjectId(lawyerId),
      courtId: new Types.ObjectId(courtId),
      status,
      hearingIds: [],
    });

    // Populate the references in the response
    const populatedCase = await Case.findById(newCase._id)
      .populate("lawyerId", "name specialization")
      .populate("courtId", "name location");

    return NextResponse.json(populatedCase, { status: 201 });
  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json(
      { error: "Failed to create case" },
      { status: 500 }
    );
  }
}
