"use server";

import dbConnect from "@/lib/mongoose";
import Case from "@/database/case.model";
import { Types, FilterQuery } from "mongoose";
import logger from "@/lib/logger";
import Lawyer from "@/database/lawyer.model";

export async function getCases(params: GetCasesParams = {}) {
  try {
    await dbConnect();
    logger.info({ params }, "Fetching cases with params");
    
    const { 
      page = 1, 
      pageSize = 10, 
      query, 
      filter, 
      sort = "-createdAt",
      courtId,
      lawyerId
    } = params;

    const searchQuery: FilterQuery<typeof Case> = {};

    // Handle specific filters
    if (courtId && Types.ObjectId.isValid(courtId)) {
      searchQuery.courtId = new Types.ObjectId(courtId);
    }

    if (lawyerId && Types.ObjectId.isValid(lawyerId)) {
      searchQuery.lawyerId = new Types.ObjectId(lawyerId);
    }

    // Handle general search query
    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: "i" } },
        { caseNumber: { $regex: query, $options: "i" } },
        { clientName: { $regex: query, $options: "i" } }
      ];
    }

    // Handle additional filters
    if (filter) {
      try {
        const filterObj: FilterQuery<typeof Case> = JSON.parse(filter);
        Object.assign(searchQuery, filterObj);
      } catch (e) {
        logger.error({ error: e }, "Invalid filter format");
      }
    }

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Execute query
    const [cases, total] = await Promise.all([
      Case.find(searchQuery)
        .populate("courtId", "name location")
        .populate("lawyerId", "name specialization")
        .sort(sort)
        .skip(skip)
        .limit(pageSize),
      Case.countDocuments(searchQuery)
    ]);

    logger.info({ count: cases.length, total }, "Successfully fetched cases");
    
    // Serialize the data before returning
    const serializedCases = JSON.parse(JSON.stringify(cases));
    
    return {
      data: serializedCases,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    logger.error({ error }, "Error fetching cases");
    throw error;
  }
}

export async function getCaseById(id: string) {
  try {
    await dbConnect();
    logger.info({ caseId: id }, "Fetching case by ID");
    
    if (!Types.ObjectId.isValid(id)) {
      logger.error({ caseId: id }, "Invalid case ID");
      throw new Error("Invalid case ID");
    }

    const case_ = await Case.findById(id)
      .populate("lawyerId", "name specialization")
      .populate("courtId", "name location")
      .populate("hearingIds", "date description");

    if (!case_) {
      logger.error({ caseId: id }, "Case not found");
      throw new Error("Case not found");
    }

    logger.info({ caseId: id }, "Successfully fetched case");
    return case_;
  } catch (error) {
    logger.error({ error, caseId: id }, "Error fetching case by ID");
    throw error;
  }
}

export async function createCase(data: CreateCaseParams) {
  try {
    await dbConnect();
    logger.info({ data }, "Creating new case");
    
    const { caseNumber, title, clientName, lawyerId, courtId, status = "pending" } = data;

    if (!Types.ObjectId.isValid(lawyerId) || !Types.ObjectId.isValid(courtId)) {
      logger.error({ lawyerId, courtId }, "Invalid lawyer or court ID");
      throw new Error("Invalid lawyer or court ID");
    }

    const existingCase = await Case.findOne({ caseNumber });
    if (existingCase) {
      logger.error({ caseNumber }, "Case number already exists");
      throw new Error("Case number already exists");
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
    if (lawyerId) {
      await Lawyer.findByIdAndUpdate(lawyerId, { $inc: { caseCount: 1 } });
      logger.info({ lawyerId, caseId: newCase._id }, "Updated lawyer's case count");
    }

    logger.info({ caseId: newCase._id }, "Successfully created case");
    return await Case.findById(newCase._id)
      .populate("lawyerId", "name specialization")
      .populate("courtId", "name location");
  } catch (error) {
    logger.error({ error, data }, "Error creating case");
    throw error;
  }
}

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
      await Lawyer.findByIdAndUpdate(case_.lawyerId, { $inc: { caseCount: -1 } });
      logger.info({ lawyerId: case_.lawyerId, caseId: id }, "Updated lawyer's case count");
    }

    const deletedCase = await Case.findByIdAndDelete(id);
    logger.info({ caseId: id }, "Successfully deleted case");
    return deletedCase;
  } catch (error) {
    logger.error({ error, caseId: id }, "Error deleting case");
    throw error;
  }
} 