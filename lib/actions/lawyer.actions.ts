"use server";

import dbConnect from "@/lib/mongoose";
import Lawyer from "@/database/lawyer.model";
import Case from "@/database/case.model";
import { FilterQuery, Types } from "mongoose";
import logger from "@/lib/logger";

export async function getLawyers(params: GetLawyersParams = {}) {
  try {
    await dbConnect();
    logger.info({ params }, "Fetching lawyers with params");
    
    const { 
      page = 1, 
      pageSize = 10, 
      query, 
      filter, 
      sort = "name",
      role
    } = params;

    const searchQuery: FilterQuery<typeof Lawyer> = {};

    // Handle specific filters
    if (role) {
      searchQuery.role = role;
    }

    // Handle general search query
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { specialization: { $regex: query, $options: "i" } }
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
    const [lawyers, total] = await Promise.all([
      Lawyer.find(searchQuery)
        .sort(sort)
        .skip(skip)
        .limit(pageSize),
      Lawyer.countDocuments(searchQuery)
    ]);

    logger.info({ count: lawyers.length, total }, "Successfully fetched lawyers");
    
    // Serialize the data before returning
    const serializedLawyers = JSON.parse(JSON.stringify(lawyers));
    
    return {
      data: serializedLawyers,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    logger.error({ error }, "Error fetching lawyers");
    throw error;
  }
}

export async function getLawyerById(id: string) {
  try {
    await dbConnect();
    logger.info({ lawyerId: id }, "Fetching lawyer by ID");
    
    if (!Types.ObjectId.isValid(id)) {
      logger.error({ lawyerId: id }, "Invalid lawyer ID");
      throw new Error("Invalid lawyer ID");
    }

    const lawyer = await Lawyer.findById(id);
    if (!lawyer) {
      logger.error({ lawyerId: id }, "Lawyer not found");
      throw new Error("Lawyer not found");
    }

    logger.info({ lawyerId: id }, "Successfully fetched lawyer");
    return lawyer;
  } catch (error) {
    logger.error({ error, lawyerId: id }, "Error fetching lawyer by ID");
    throw error;
  }
}

export async function createLawyer(data: CreateLawyerParams) {
  try {
    await dbConnect();
    logger.info({ data }, "Creating new lawyer");
    
    const { name, specialization, role = "lawyer" } = data;

    const newLawyer = await Lawyer.create({
      name,
      specialization,
      role,
      caseCount: 0,
    });

    logger.info({ lawyerId: newLawyer._id }, "Successfully created lawyer");
    return newLawyer;
  } catch (error) {
    logger.error({ error, data }, "Error creating lawyer");
    throw error;
  }
}

export async function updateLawyer(data: UpdateLawyerParams) {
  try {
    await dbConnect();
    logger.info({ data }, "Updating lawyer");
    
    const { id, ...updateData } = data;

    if (!Types.ObjectId.isValid(id)) {
      logger.error({ lawyerId: id }, "Invalid lawyer ID");
      throw new Error("Invalid lawyer ID");
    }

    const updatedLawyer = await Lawyer.findByIdAndUpdate(
      id,
      { ...updateData },
      { new: true }
    );

    if (!updatedLawyer) {
      logger.error({ lawyerId: id }, "Lawyer not found");
      throw new Error("Lawyer not found");
    }

    logger.info({ lawyerId: id }, "Successfully updated lawyer");
    return updatedLawyer;
  } catch (error) {
    logger.error({ error, data }, "Error updating lawyer");
    throw error;
  }
}

export async function deleteLawyer(id: string) {
  try {
    await dbConnect();
    logger.info({ lawyerId: id }, "Deleting lawyer");
    
    if (!Types.ObjectId.isValid(id)) {
      logger.error({ lawyerId: id }, "Invalid lawyer ID");
      throw new Error("Invalid lawyer ID");
    }

    const lawyer = await Lawyer.findById(id);
    if (!lawyer) {
      logger.error({ lawyerId: id }, "Lawyer not found");
      throw new Error("Lawyer not found");
    }

    // Check if lawyer has any cases
    const caseCount = await Case.countDocuments({ lawyerId: id });
    if (caseCount > 0) {
      logger.error({ lawyerId: id, caseCount }, "Cannot delete lawyer with assigned cases");
      throw new Error("Cannot delete lawyer with assigned cases");
    }

    const deletedLawyer = await Lawyer.findByIdAndDelete(id);
    logger.info({ lawyerId: id }, "Successfully deleted lawyer");
    return deletedLawyer;
  } catch (error) {
    logger.error({ error, lawyerId: id }, "Error deleting lawyer");
    throw error;
  }
} 