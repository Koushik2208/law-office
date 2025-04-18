import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { Lawyer } from "@/database";
import { LawyerSchema } from "@/lib/validations";

// GET /api/users/[id]
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  try {
    await dbConnect();

    const lawyer = await Lawyer.findById(id);
    if (!lawyer) throw new NotFoundError("Lawyer");

    return NextResponse.json({ success: true, data: lawyer }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// DELETE /api/users/[id]
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  try {
    await dbConnect();

    const lawyer = await Lawyer.findByIdAndDelete(id);
    if (!lawyer) throw new NotFoundError("Lawyer");

    return NextResponse.json({ success: true, data: lawyer }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// PUT /api/users/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  try {
    await dbConnect();

    const body = await request.json();
    const validatedData = LawyerSchema.partial().parse(body);

    const updatedLawyer = await Lawyer.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!updatedLawyer) throw new NotFoundError("Lawyer");

    return NextResponse.json(
        { success: true, data: updatedLawyer },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
