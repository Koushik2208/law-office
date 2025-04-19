"use server";

import dbConnect from "@/lib/mongoose";
import Case from "@/database/case.model";
import { Types, FilterQuery } from "mongoose";
import logger from "@/lib/logger";
import Lawyer from "@/database/lawyer.model";
import { CaseSchema, IdSchema } from "../validations";
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

export async function getCaseId(
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

// export async function createCase(data: CreateCaseParams) {
//   try {
//     await dbConnect();
//     logger.info({ data }, "Creating new case");

//     const {
//       caseNumber,
//       title,
//       clientName,
//       lawyerId,
//       courtId,
//       status = "pending",
//     } = data;

//     if (!Types.ObjectId.isValid(lawyerId) || !Types.ObjectId.isValid(courtId)) {
//       logger.error({ lawyerId, courtId }, "Invalid lawyer or court ID");
//       throw new Error("Invalid lawyer or court ID");
//     }

//     const existingCase = await Case.findOne({ caseNumber });
//     if (existingCase) {
//       logger.error({ caseNumber }, "Case number already exists");
//       throw new Error("Case number already exists");
//     }

//     const newCase = await Case.create({
//       caseNumber,
//       title,
//       clientName,
//       lawyerId: new Types.ObjectId(lawyerId),
//       courtId: new Types.ObjectId(courtId),
//       status,
//     });

//     // Update lawyer's caseCount
//     if (lawyerId) {
//       await Lawyer.findByIdAndUpdate(lawyerId, { $inc: { caseCount: 1 } });
//       logger.info(
//         { lawyerId, caseId: newCase._id },
//         "Updated lawyer's case count"
//       );
//     }

//     logger.info({ caseId: newCase._id }, "Successfully created case");
//     return await Case.findById(newCase._id)
//       .populate("lawyerId", "name specialization")
//       .populate("courtId", "name location");
//   } catch (error) {
//     logger.error({ error, data }, "Error creating case");
//     throw error;
//   }
// }

export async function updateCase(data: UpdateCaseParams) {
  try {
    await dbConnect();
    logger.info({ data }, "Updating case");

    const { id, ...updateData } = data;

    if (!Types.ObjectId.isValid(id)) {
      logger.error({ caseId: id }, "Invalid case ID");
      throw new Error("Invalid case ID");
    }

    if (updateData.lawyerId && !Types.ObjectId.isValid(updateData.lawyerId)) {
      logger.error({ lawyerId: updateData.lawyerId }, "Invalid lawyer ID");
      throw new Error("Invalid lawyer ID");
    }

    if (updateData.courtId && !Types.ObjectId.isValid(updateData.courtId)) {
      logger.error({ courtId: updateData.courtId }, "Invalid court ID");
      throw new Error("Invalid court ID");
    }

    const updatedCase = await Case.findByIdAndUpdate(
      id,
      { ...updateData },
      { new: true }
    )
      .populate("lawyerId", "name specialization")
      .populate("courtId", "name location");

    if (!updatedCase) {
      logger.error({ caseId: id }, "Case not found");
      throw new Error("Case not found");
    }

    logger.info({ caseId: id }, "Successfully updated case");
    return updatedCase;
  } catch (error) {
    logger.error({ error, data }, "Error updating case");
    throw error;
  }
}

export async function deleteCase(id: string) {
  try {
    await dbConnect();
    logger.info({ caseId: id }, "Deleting case");

    if (!Types.ObjectId.isValid(id)) {
      logger.error({ caseId: id }, "Invalid case ID");
      throw new Error("Invalid case ID");
    }

    const case_ = await Case.findById(id);
    if (!case_) {
      logger.error({ caseId: id }, "Case not found");
      throw new Error("Case not found");
    }

    // Update lawyer's caseCount if case has a lawyer
    if (case_.lawyerId) {
      await Lawyer.findByIdAndUpdate(case_.lawyerId, {
        $inc: { caseCount: -1 },
      });
      logger.info(
        { lawyerId: case_.lawyerId, caseId: id },
        "Updated lawyer's case count"
      );
    }

    const deletedCase = await Case.findByIdAndDelete(id);
    logger.info({ caseId: id }, "Successfully deleted case");
    return deletedCase;
  } catch (error) {
    logger.error({ error, caseId: id }, "Error deleting case");
    throw error;
  }
}
