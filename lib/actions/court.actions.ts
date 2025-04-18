"use server";

import dbConnect from "@/lib/mongoose";
import Court from "@/database/court.model";
import { FilterQuery, Types } from "mongoose";
import logger from "@/lib/logger";

export async function getCourts(params: GetCourtsParams = {}) {
  try {
    await dbConnect();
    logger.info({ params }, "Fetching courts with params");
    
    const { 
      page = 1, 
      pageSize = 10, 
      query, 
      filter, 
      sort = "name"
    } = params;

    const searchQuery: FilterQuery<typeof Court> = {};

    // Handle general search query
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } }
      ];
    }

    // Handle additional filters
    if (filter) {
      try {
        const filterObj = JSON.parse(filter);
        Object.assign(searchQuery, filterObj);
      } catch (e) {
        logger.error({ error: e }, "Invalid filter format");
      }
    }

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Execute query
    const [courts, total] = await Promise.all([
      Court.find(searchQuery)
        .sort(sort)
        .skip(skip)
        .limit(pageSize),
      Court.countDocuments(searchQuery)
    ]);

    logger.info({ count: courts.length, total }, "Successfully fetched courts");
    
    // Serialize the data before returning
    const serializedCourts = JSON.parse(JSON.stringify(courts));
    
    return {
      data: serializedCourts,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    logger.error({ error }, "Error fetching courts");
    throw error;
  }
}

export async function getCourtById(id: string) {
  try {
    await dbConnect();
    logger.info({ courtId: id }, "Fetching court by ID");
    
    if (!Types.ObjectId.isValid(id)) {
      logger.error({ courtId: id }, "Invalid court ID");
      throw new Error("Invalid court ID");
    }

    const court = await Court.findById(id);
    if (!court) {
      logger.error({ courtId: id }, "Court not found");
      throw new Error("Court not found");
    }

    logger.info({ courtId: id }, "Successfully fetched court");
    return court;
  } catch (error) {
    logger.error({ error, courtId: id }, "Error fetching court by ID");
    throw error;
  }
}

export async function createCourt(data: CreateCourtParams) {
  try {
    await dbConnect();
    logger.info({ data }, "Creating new court");
    
    const { name, location } = data;

    const newCourt = await Court.create({
      name,
      location,
    });

    logger.info({ courtId: newCourt._id }, "Successfully created court");
    return newCourt;
  } catch (error) {
    logger.error({ error, data }, "Error creating court");
    throw error;
  }
}

export async function updateCourt(data: UpdateCourtParams) {
  try {
    await dbConnect();
    logger.info({ data }, "Updating court");
    
    const { id, ...updateData } = data;

    if (!Types.ObjectId.isValid(id)) {
      logger.error({ courtId: id }, "Invalid court ID");
      throw new Error("Invalid court ID");
    }

    const updatedCourt = await Court.findByIdAndUpdate(
      id,
      { ...updateData },
      { new: true }
    );

    if (!updatedCourt) {
      logger.error({ courtId: id }, "Court not found");
      throw new Error("Court not found");
    }

    logger.info({ courtId: id }, "Successfully updated court");
    return updatedCourt;
  } catch (error) {
    logger.error({ error, data }, "Error updating court");
    throw error;
  }
}

export async function deleteCourt(id: string) {
  try {
    await dbConnect();
    logger.info({ courtId: id }, "Deleting court");
    
    if (!Types.ObjectId.isValid(id)) {
      logger.error({ courtId: id }, "Invalid court ID");
      throw new Error("Invalid court ID");
    }

    const deletedCourt = await Court.findByIdAndDelete(id);
    if (!deletedCourt) {
      logger.error({ courtId: id }, "Court not found");
      throw new Error("Court not found");
    }

    logger.info({ courtId: id }, "Successfully deleted court");
    return deletedCourt;
  } catch (error) {
    logger.error({ error, courtId: id }, "Error deleting court");
    throw error;
  }
} 