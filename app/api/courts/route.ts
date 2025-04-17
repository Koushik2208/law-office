// app/api/courts/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Court } from "@/database";

export async function GET() {
  try {
    await dbConnect();
    const courts = await Court.find();
    return NextResponse.json(courts);
  } catch (error) {
    console.error("Error fetching courts:", error);
    return NextResponse.json(
      { error: "Failed to fetch courts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqBody = await request.json();
    const { name, location } = reqBody;

    if (!name || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newCourt = await Court.create({
      name,
      location,
    });

    return NextResponse.json(newCourt, { status: 201 });
  } catch (error) {
    console.error("Error creating court:", error);
    return NextResponse.json(
      { error: "Failed to create court" },
      { status: 500 }
    );
  }
}
