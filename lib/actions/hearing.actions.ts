"use server";

import dbConnect from "@/lib/mongoose";
import Hearing from "@/database/hearing.model";
import Case from "@/database/case.model";
import { Types, FilterQuery } from "mongoose";
import logger from "@/lib/logger";

export async function getHearings(params: GetHearingsParams = {}) {
  try {
    await dbConnect();
    logger.info({ params }, "Fetching hearings with params");
    
    const { 
      page = 1, 
      pageSize = 10, 
      query, 
      filter, 
      sort = "-date",
      caseId
    } = params;

    const searchQuery: FilterQuery<typeof Hearing> = {};

    // Handle specific filters
    if (caseId && Types.ObjectId.isValid(caseId)) {
      searchQuery.caseId = new Types.ObjectId(caseId);
    }

    // Handle general search query
    if (query) {
      searchQuery.$or = [
        { description: { $regex: query, $options: "i" } }
      ];
    }

    // Handle additional filters
    if (filter) {
      try {
        const filterObj: FilterQuery<typeof Hearing> = JSON.parse(filter);
        Object.assign(searchQuery, filterObj);
      } catch (e) {
        logger.error({ error: e }, "Invalid filter format");
      }
    }

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Execute query
    const [hearings, total] = await Promise.all([
      Hearing.find(searchQuery)
        .populate("caseId", "title caseNumber clientName")
        .sort(sort)
        .skip(skip)
        .limit(pageSize),
      Hearing.countDocuments(searchQuery)
    ]);

    logger.info({ count: hearings.length, total }, "Successfully fetched hearings");
    
    // Serialize the data before returning
    const serializedHearings = JSON.parse(JSON.stringify(hearings));
    
    return {
      data: serializedHearings,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    logger.error({ error }, "Error fetching hearings");
    throw error;
  }
}

export async function getHearingById(id: string) {
  try {
    await dbConnect();
    logger.info({ hearingId: id }, "Fetching hearing by ID");
    
    if (!Types.ObjectId.isValid(id)) {
      logger.error({ hearingId: id }, "Invalid hearing ID");
      throw new Error("Invalid hearing ID");
    }

    const hearing = await Hearing.findById(id)
      .populate("caseId", "title caseNumber clientName");

    if (!hearing) {
      logger.error({ hearingId: id }, "Hearing not found");
      throw new Error("Hearing not found");
    }

    logger.info({ hearingId: id }, "Successfully fetched hearing");
    return hearing;
  } catch (error) {
    logger.error({ error, hearingId: id }, "Error fetching hearing by ID");
    throw error;
  }
}

export async function createHearing(data: CreateHearingParams) {
  try {
    await dbConnect();
    logger.info({ data }, "Creating new hearing");
    
    const { caseId, date, description } = data;

    if (!Types.ObjectId.isValid(caseId)) {
      logger.error({ caseId }, "Invalid case ID");
      throw new Error("Invalid case ID");
    }

    const existingCase = await Case.findById(caseId);
    if (!existingCase) {
      logger.error({ caseId }, "Case not found");
      throw new Error("Case not found");
    }

    const newHearing = await Hearing.create({
      caseId: new Types.ObjectId(caseId),
      date,
      description,
    });

    await Case.findByIdAndUpdate(caseId, {
      $push: { hearingIds: newHearing._id },
    });

    logger.info({ hearingId: newHearing._id, caseId }, "Successfully created hearing");
    return await Hearing.findById(newHearing._id)
      .populate("caseId", "title caseNumber clientName");
  } catch (error) {
    logger.error({ error, data }, "Error creating hearing");
    throw error;
  }
}

export async function updateHearing(data: UpdateHearingParams) {
  try {
    await dbConnect();
    logger.info({ data }, "Updating hearing");
    
    const { id, ...updateData } = data;

    if (!Types.ObjectId.isValid(id)) {
      logger.error({ hearingId: id }, "Invalid hearing ID");
      throw new Error("Invalid hearing ID");
    }

    if (updateData.caseId && !Types.ObjectId.isValid(updateData.caseId)) {
      logger.error({ caseId: updateData.caseId }, "Invalid case ID");
      throw new Error("Invalid case ID");
    }

    const updatedHearing = await Hearing.findByIdAndUpdate(
      id,
      { ...updateData },
      { new: true }
    ).populate("caseId", "title caseNumber clientName");

    if (!updatedHearing) {
      logger.error({ hearingId: id }, "Hearing not found");
      throw new Error("Hearing not found");
    }

    logger.info({ hearingId: id }, "Successfully updated hearing");
    return updatedHearing;
  } catch (error) {
    logger.error({ error, data }, "Error updating hearing");
    throw error;
  }
}

export async function deleteHearing(id: string) {
  try {
    await dbConnect();
    logger.info({ hearingId: id }, "Deleting hearing");
    
    if (!Types.ObjectId.isValid(id)) {
      logger.error({ hearingId: id }, "Invalid hearing ID");
      throw new Error("Invalid hearing ID");
    }

    const hearing = await Hearing.findById(id);
    if (!hearing) {
      logger.error({ hearingId: id }, "Hearing not found");
      throw new Error("Hearing not found");
    }

    await Case.findByIdAndUpdate(hearing.caseId, {
      $pull: { hearingIds: hearing._id },
    });

    const deletedHearing = await Hearing.findByIdAndDelete(id);
    logger.info({ hearingId: id }, "Successfully deleted hearing");
    return deletedHearing;
  } catch (error) {
    logger.error({ error, hearingId: id }, "Error deleting hearing");
    throw error;
  }
} 