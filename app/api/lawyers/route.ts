// app/api/lawyers/route.ts

import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Lawyer } from "@/database";

export async function GET() {
  try {
    await dbConnect();
    const lawyers = await Lawyer.find();
    
    // Get case counts for each lawyer
    const lawyersWithCaseCount = await Promise.all(
      lawyers.map(async (lawyer) => {
        // const caseCount = await Case.countDocuments({ lawyerId: lawyer._id });
        return lawyer.toObject();
      })
    );

    return NextResponse.json(lawyersWithCaseCount);
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    return NextResponse.json(
      { error: "Failed to fetch lawyers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqBody = await request.json();
    const { name, specialization, role = "lawyer" } = reqBody;

    if (!name || !specialization) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newLawyer = await Lawyer.create({
      name,
      specialization,
      role,
      caseCount: 0,
    });

    return NextResponse.json(newLawyer, { status: 201 });
  } catch (error) {
    console.error("Error creating lawyer:", error);
    return NextResponse.json(
      { error: "Failed to create lawyer" },
      { status: 500 }
    );
  }
}
