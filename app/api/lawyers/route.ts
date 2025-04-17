// app/api/lawyers/route.ts

import { NextResponse, NextRequest } from "next/server";

interface Lawyer {
  id: number;
  name: string;
  specialization: string;
  caseCount: number;
  role: "admin" | "lawyer";
}

// In-memory lawyer data with roles
const lawyersData: Lawyer[] = [
  {
    id: 100,
    name: "Admin User",
    specialization: "General",
    caseCount: 0,
    role: "admin",
  },
  {
    id: 101,
    name: "John Doe",
    specialization: "Corporate Law",
    caseCount: 3,
    role: "lawyer",
  },
  {
    id: 102,
    name: "Jane Smith",
    specialization: "Criminal Law",
    caseCount: 1,
    role: "lawyer",
  },
];

// Sample in-memory case data
interface Case {
  id: number;
  title: string;
  lawyerId: number;
  courtId: number;
  hearingIds: number[];
  status: "pending" | "disposed";
}

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

export async function GET() {
  const lawyersWithCaseCount: Lawyer[] = lawyersData.map((lawyer) => {
    const caseCount = casesData.filter(
      (caseItem) => caseItem.lawyerId === lawyer.id
    ).length;
    return { ...lawyer, caseCount };
  });
  return NextResponse.json(lawyersWithCaseCount);
}

export async function POST(request: NextRequest) {
  // 1. Authentication: Implement logic here to identify the logged-in user.
  //    This might involve checking for a session cookie or a JWT in the request headers.

  // 2. Authorization: Implement logic here to check if the logged-in user has the 'admin' role.
  //    You would typically retrieve the user's role from your user data store (e.g., database)
  //    based on the authenticated user's identity.

  // 3. If the user is not an admin, return an unauthorized response.
  //    Example:
  //    if (/* user's role is not 'admin' */) {
  //      return NextResponse.json({ error: 'Unauthorized. Admin role required.' }, { status: 403 });
  //    }

  try {
    // 4. If the user is an admin, proceed to create the new lawyer.
    const reqBody = await request.json();
    const { name, specialization, role = "lawyer" } = reqBody;

    // 5. In a real application, you would:
    //    - Validate the incoming data (e.g., check if name and specialization are provided).
    //    - Generate a unique ID for the new lawyer (usually handled by the database).
    //    - Create a new Lawyer object.
    //    - Save the new lawyer to your data store (e.g., database).

    // 6. For this in-memory example, we'll just log the received data.
    console.log(
      "Received lawyer creation request (admin check to be implemented):",
      { name, specialization, role }
    );

    // 7. Return a simple success message for now. In a real app, you'd likely return the created lawyer object.
    return NextResponse.json({
      message: "Lawyer creation endpoint (admin check to be implemented)",
    });
  } catch (error) {
    // 8. Handle any errors during the process.
    console.error("Error processing lawyer creation request:", error);
    return NextResponse.json(
      { error: "Failed to process lawyer creation request" },
      { status: 500 }
    );
  }
}
