"use server";

import Lawyer from "@/database/lawyer.model";
import { FilterQuery } from "mongoose";
import action from "../handlers/action";
import {
  CreateLawyerSchema,
  IdSchema,
  LawyerSchema,
  UpdateLawyerSchema,
} from "../validations";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import { Case } from "@/database";

export async function getLawyers(
  params: GetLawyersParams
): Promise<ActionResponse<{ lawyers: Lawyer[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: LawyerSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    page = 1,
    pageSize = 10,
    query,
    sort,
    role,
  } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Lawyer> = {};

  if (role) {
    filterQuery.role = role;
  } else {
    filterQuery.role = { $in: ["admin", "lawyer", "guest"] };
  }

  if (query) {
    filterQuery.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
      { specialization: { $regex: query, $options: "i" } },
      { role: { $regex: query, $options: "i" } },
    ];
  }

  let sortCriteria: Record<string, 1 | -1> = {};

  if (sort) {
    sortCriteria = { [sort]: 1 };
  } else {
    sortCriteria = { name: 1 };
  }

  try {
    const totalLawyers = await Lawyer.countDocuments(filterQuery);

    const lawyers = await Lawyer.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalLawyers > skip + lawyers.length;

    return {
      success: true,
      data: { lawyers: JSON.parse(JSON.stringify(lawyers)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getLawyerById(
  params: IdParams
): Promise<ActionResponse<Lawyer>> {
  const validationResult = await action({
    params,
    schema: IdSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { id } = validationResult.params!;

  try {
    const lawyer = await Lawyer.findById(id);
    if (!lawyer) throw new NotFoundError("Lawyer");
    return { success: true, data: JSON.parse(JSON.stringify(lawyer)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createLawyer(
  params: CreateLawyerParams
): Promise<ActionResponse<Lawyer>> {
  const validationResult = await action({
    params,
    schema: CreateLawyerSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, specialization, role } = validationResult.params!;

  try {
    const newLawyer = await Lawyer.create({
      name,
      specialization,
      role,
      caseCount: 0,
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newLawyer)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateLawyer(
  params: UpdateLawyerParams
): Promise<ActionResponse<Lawyer>> {
  const validationResult = await action({
    params,
    schema: UpdateLawyerSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { id, ...updateData } = validationResult.params!;

  try {
    const updatedLawyer = await Lawyer.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedLawyer) {
      throw new NotFoundError("Lawyer");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedLawyer)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteLawyer(
  params: IdParams
): Promise<ActionResponse<null>> {
  const validationResult = await action({
    params,
    schema: IdSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { id } = validationResult.params!;

  try {
    const lawyer = await Lawyer.findById(id);
    if (!lawyer) {
      return { success: false, error: { message: "Lawyer not found" } };
    }

    await Case.updateMany(
      { lawyerId: id },
      { status: "unassigned", lawyerId: null }
    );

    const deletedLawyer = await Lawyer.findByIdAndDelete(id);

    if (!deletedLawyer) {
      return { success: false, error: { message: "Failed to delete lawyer" } };
    }

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
