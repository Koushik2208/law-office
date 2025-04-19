"use server";

import Case from "@/database/case.model";
import { Types, FilterQuery } from "mongoose";
import Lawyer from "@/database/lawyer.model";
import {
  CaseSchema,
  CreateCaseSchema,
  UpdateCaseSchema,
  IdSchema,
} from "../validations";
import handleError from "../handlers/error";
import action from "../handlers/action";
import { NotFoundError } from "../http-errors";

export async function getCases(
  params: GetCasesParams
): Promise<ActionResponse<{ cases: Case[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: CaseSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    page = 1,
    pageSize = 10,
    query,
    sort,
    lawyerId,
    courtId,
    status,
    startDate,
    endDate,
  } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Case> = {};

  if (courtId && Types.ObjectId.isValid(courtId)) {
    filterQuery.courtId = new Types.ObjectId(courtId);
  }

  if (lawyerId && Types.ObjectId.isValid(lawyerId)) {
    filterQuery.lawyerId = new Types.ObjectId(lawyerId);
  }

  if (query) {
    filterQuery.$or = [
      { title: { $regex: query, $options: "i" } },
      { caseNumber: { $regex: query, $options: "i" } },
      { clientName: { $regex: query, $options: "i" } },
    ];
  }

  if (status) {
    filterQuery.status = status;
  }

  if (startDate && endDate) {
    filterQuery.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  let sortCriteria: Record<string, 1 | -1> = {};

  if (sort) {
    sortCriteria = { [sort]: 1 };
  } else {
    sortCriteria = { createdAt: -1 };
  }

  try {
    const totalCases = await Case.countDocuments(filterQuery);
    const cases = await Case.find(filterQuery)
      .populate("courtId", "name location")
      .populate("lawyerId", "name specialization")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalCases > skip + limit;

    return {
      success: true,
      data: { cases: JSON.parse(JSON.stringify(cases)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getCaseById(
  params: IdParams
): Promise<ActionResponse<Case>> {
  const validationResult = await action({
    params,
    schema: IdSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { id } = validationResult.params!;

  try {
    const case_item = await Case.findById(id)
      .populate("lawyerId", "name specialization")
      .populate("courtId", "name location");
    if (!case_item) throw new NotFoundError("Case");
    return { success: true, data: JSON.parse(JSON.stringify(case_item)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createCase(
  params: CreateCaseParams
): Promise<ActionResponse<Case>> {
  const validationResult = await action({
    params,
    schema: CreateCaseSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    caseNumber,
    title,
    clientName,
    lawyerId,
    courtId,
    status = "pending",
  } = validationResult.params!;

  try {
    // Check if case number already exists
    const existingCase = await Case.findOne({ caseNumber });
    if (existingCase) {
      return {
        success: false,
        error: { message: "Case number already exists" },
      };
    }

    // Validate lawyer and court IDs
    if (!Types.ObjectId.isValid(lawyerId) || !Types.ObjectId.isValid(courtId)) {
      return {
        success: false,
        error: { message: "Invalid lawyer or court ID" },
      };
    }

    const newCase = await Case.create({
      caseNumber,
      title,
      clientName,
      lawyerId: new Types.ObjectId(lawyerId),
      courtId: new Types.ObjectId(courtId),
      status,
    });

    // Update lawyer's caseCount
    await Lawyer.findByIdAndUpdate(lawyerId, { $inc: { caseCount: 1 } });

    const populatedCase = await Case.findById(newCase._id)
      .populate("lawyerId", "name specialization")
      .populate("courtId", "name location");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(populatedCase)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateCase(
  params: UpdateCaseParams
): Promise<ActionResponse<Case>> {
  const validationResult = await action({
    params,
    schema: UpdateCaseSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { id, ...updateData } = validationResult.params!;

  try {
    // Validate case ID
    if (!Types.ObjectId.isValid(id)) {
      return {
        success: false,
        error: { message: "Invalid case ID" },
      };
    }

    // Validate lawyer and court IDs if they are being updated
    if (updateData.lawyerId && !Types.ObjectId.isValid(updateData.lawyerId)) {
      return {
        success: false,
        error: { message: "Invalid lawyer ID" },
      };
    }

    if (updateData.courtId && !Types.ObjectId.isValid(updateData.courtId)) {
      return {
        success: false,
        error: { message: "Invalid court ID" },
      };
    }

    const updatedCase = await Case.findByIdAndUpdate(
      id,
      { ...updateData },
      { new: true, runValidators: true }
    )
      .populate("lawyerId", "name specialization")
      .populate("courtId", "name location");

    if (!updatedCase) {
      throw new NotFoundError("Case");
    }

    const assignedLawyer = await Lawyer.findById(updatedCase.lawyerId);

    if (assignedLawyer) {
      assignedLawyer.caseCount = await Case.countDocuments({
        lawyerId: assignedLawyer._id,
      });
      await assignedLawyer.save();
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedCase)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteCase(
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
    const case_ = await Case.findById(id);
    if (!case_) {
      return { success: false, error: { message: "Case not found" } };
    }

    // Update lawyer's caseCount if case has a lawyer
    if (case_.lawyerId) {
      await Lawyer.findByIdAndUpdate(case_.lawyerId, {
        $inc: { caseCount: -1 },
      });
    }

    const deletedCase = await Case.findByIdAndDelete(id);
    if (!deletedCase) {
      return { success: false, error: { message: "Failed to delete case" } };
    }

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
