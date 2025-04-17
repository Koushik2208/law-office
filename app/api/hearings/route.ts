// app/api/hearings/route.ts

import { NextRequest, NextResponse } from "next/server";

interface Hearing {
  id: number;
  caseId: number;
  date: string;
  description: string;
}

const hearings: Hearing[] = [
  { id: 301, caseId: 1, date: "2024-05-10", description: "Initial hearing" },
  {
    id: 302,
    caseId: 2,
    date: "2024-05-15",
    description: "Document submission",
  },
  {
    id: 303,
    caseId: 1,
    date: "2024-05-22",
    description: "Witness examination",
  },
];

export async function GET() {
  return NextResponse.json(hearings);
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    // Expected request body:
    // { caseId: number, date: string, description: string }

    const { caseId, date, description } = reqBody;

    // In a real application, you would:
    // 1. Validate the incoming data (check if caseId exists).
    // 2. Generate a new unique ID for the hearing.
    // 3. Create a new Hearing object.
    // 4. Add it to `hearingsData`.
    // 5. Potentially update the corresponding Case's `hearingIds` array.
    // 6. Return the new hearing object.

    console.log("Received hearing creation request:", {
      caseId,
      date,
      description,
    });

    return NextResponse.json({ message: "Hearing created!" }); // Placeholder for now
  } catch (error) {
    console.error("Error creating hearing:", error);
    return NextResponse.json(
      { error: "Failed to create hearing" },
      { status: 500 }
    );
  }
}
