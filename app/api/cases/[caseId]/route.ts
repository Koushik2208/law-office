// app/api/cases/[caseId]/route.ts

import { NextResponse, NextRequest } from "next/server";

interface Case {
  id: number;
  title: string;
  lawyerId: number;
  courtId: number;
  hearingIds: number[];
}

interface Hearing {
  id: number;
  caseId: number;
  date: string;
  description: string;
}

// Sample in-memory case data (same as before)
const casesData: Case[] = [
  {
    id: 1,
    title: "Case A",
    lawyerId: 101,
    courtId: 201,
    hearingIds: [301, 303],
  },
  { id: 2, title: "Case B", lawyerId: 102, courtId: 202, hearingIds: [302] },
  { id: 3, title: "Case C", lawyerId: 101, courtId: 202, hearingIds: [] },
  { id: 4, title: "Case D", lawyerId: 101, courtId: 201, hearingIds: [] },
];

// Sample in-memory hearing data (same as before)
const hearingsData: Hearing[] = [
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
  { id: 304, caseId: 3, date: "2024-06-01", description: "First mention" },
];

// Handler for GET requests to /api/cases/[caseId]
export async function GET(
  request: NextRequest,
  { params }: { params: { caseId: string } } // Access the dynamic caseId parameter
) {
  const { caseId } = params;
  const caseIdInt = parseInt(caseId, 10);

  if (isNaN(caseIdInt)) {
    return NextResponse.json({ error: "Invalid case ID" }, { status: 400 });
  }

  const caseDetails = casesData.find((caseItem) => caseItem.id === caseIdInt);

  if (!caseDetails) {
    return NextResponse.json(
      { error: `Case with ID ${caseId} not found` },
      { status: 404 }
    );
  }

  // Filter hearings associated with this case
  const caseHearings = hearingsData.filter(
    (hearing) => hearing.caseId === caseIdInt
  );

  return NextResponse.json({ ...caseDetails, hearings: caseHearings });
}
