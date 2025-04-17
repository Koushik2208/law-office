// app/api/courts/route.ts

import { NextRequest, NextResponse } from "next/server";

interface Court {
  id: number;
  name: string;
  location: string;
}

export async function GET() {
  const courts: Court[] = [
    { id: 201, name: "Supreme Court", location: "New Delhi" },
    { id: 202, name: "High Court", location: "Mumbai" },
  ];
  return NextResponse.json(courts);
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    // Expected request body:
    // { name: string, location: string }

    const { name, location } = reqBody;

    // In a real application, you would:
    // 1. Validate the incoming data.
    // 2. Generate a new unique ID for the court.
    // 3. Create a new Court object.
    // 4. Add it to `courtsData`.
    // 5. Return the new court object.

    console.log("Received court creation request:", { name, location });

    return NextResponse.json({ message: "Court created!" }); // Placeholder for now
  } catch (error) {
    console.error("Error creating court:", error);
    return NextResponse.json(
      { error: "Failed to create court" },
      { status: 500 }
    );
  }
}
