// app/api/cases/route.ts

import { NextResponse, NextRequest } from "next/server";

interface Case {
  id: number;
  title: string;
  lawyerId: number;
  courtId: number;
  hearingIds: number[];
  status: "pending" | "disposed";
}

// Sample in-memory case data with status
const casesData: Case[] = [
  {
    id: 1,
    title: "Case A",
    lawyerId: 101,
    courtId: 201,
    hearingIds: [301, 303],
    status: "pending",
  },
  {
    id: 2,
    title: "Case B",
    lawyerId: 102,
    courtId: 202,
    hearingIds: [302],
    status: "disposed",
  },
  {
    id: 3,
    title: "Case C",
    lawyerId: 101,
    courtId: 202,
    hearingIds: [],
    status: "pending",
  },
  {
    id: 4,
    title: "Case D",
    lawyerId: 101,
    courtId: 201,
    hearingIds: [],
    status: "disposed",
  },
  {
    id: 5,
    title: "Case E",
    lawyerId: 102,
    courtId: 201,
    hearingIds: [],
    status: "pending",
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lawyerIdFilter = searchParams.get("lawyerId");
  const courtIdFilter = searchParams.get("courtId");
  const statusFilter = searchParams.get("status");

  let filteredCases = [...casesData];

  if (lawyerIdFilter) {
    const lawyerId = parseInt(lawyerIdFilter, 10);
    if (!isNaN(lawyerId)) {
      filteredCases = filteredCases.filter(
        (caseItem) => caseItem.lawyerId === lawyerId
      );
    }
  }

  if (courtIdFilter) {
    const courtId = parseInt(courtIdFilter, 10);
    if (!isNaN(courtId)) {
      filteredCases = filteredCases.filter(
        (caseItem) => caseItem.courtId === courtId
      );
    }
  }

  if (statusFilter) {
    if (statusFilter === "pending" || statusFilter === "disposed") {
      filteredCases = filteredCases.filter(
        (caseItem) => caseItem.status === statusFilter
      );
    }
  }

  return NextResponse.json(filteredCases);
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    // 1. Data Validation:
    //    - Check if all required fields are present in `reqBody` (title, lawyerId, courtId, status).
    //    - Validate the data types of these fields (e.g., lawyerId and courtId should be numbers, status should be 'pending' or 'disposed').
    //    - You might want to check if the provided lawyerId and courtId actually exist in your lawyer and court data (for data integrity).

    // 2. Create New Case:
    //    - Generate a unique ID for the new case (in a real database, this would likely be handled by the database). For our in-memory example, you could use `casesData.length + 1`.
    //    - Create a new `Case` object using the data from `reqBody` and the generated ID. The `hearingIds` array would typically be initialized as empty for a new case.
    //    - Add the newly created `Case` object to the `casesData` array.

    console.log("Received case creation request:", reqBody);
    return NextResponse.json({ message: "Case created!" }); // Simple response for now
  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json(
      { error: "Failed to create case" },
      { status: 500 }
    );
  }
}
