"use server";

import Court from "@/database/court.model";
import { FilterQuery } from "mongoose";
import { CourtSchema, CreateCourtSchema, UpdateCourtSchema, IdSchema } from "../validations";
import handleError from "../handlers/error";
import action from "../handlers/action";
import { NotFoundError } from "../http-errors";
import { Case } from "@/database";

export async function getCourts(
  params: GetCourtsParams
): Promise<ActionResponse<{ courts: Court[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: CourtSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    page = 1,
    pageSize = 10,
    query,
    sort,
    name,
    location,
  } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);
  const filterQuery: FilterQuery<typeof Court> = {};

  if (name) {
    filterQuery.name = { $regex: name, $options: "i" };
  }

  if (location) {
    filterQuery.location = { $regex: location, $options: "i" };
  }

  if (query) {
    filterQuery.$or = [
      { name: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
    ];
  }

  let sortCriteria: Record<string, 1 | -1> = {};

  if (sort) {
    sortCriteria = { [sort]: 1 };
  } else {
    sortCriteria = { name: 1 };
  }

  try {
    const totalCourts = await Court.countDocuments(filterQuery);
    const courts = await Court.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalCourts > skip + limit;

    return {
      success: true,
      data: { courts: JSON.parse(JSON.stringify(courts)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getCourtById(
  params: IdParams
): Promise<ActionResponse<Court>> {
  const validationResult = await action({
    params,
    schema: IdSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { id } = validationResult.params!;

  try {
    const court = await Court.findById(id);
    if (!court) throw new NotFoundError("Court");
    return { success: true, data: JSON.parse(JSON.stringify(court)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createCourt(
  params: CreateCourtParams
): Promise<ActionResponse<Court>> {
  const validationResult = await action({
    params,
    schema: CreateCourtSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, location } = validationResult.params!;

  try {
    // Check if court with same name and location already exists
    const existingCourt = await Court.findOne({ name, location });
    if (existingCourt) {
      return {
        success: false,
        error: { message: "Court with this name and location already exists" },
      };
    }

    const newCourt = await Court.create({
      name,
      location,
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newCourt)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateCourt(
  params: UpdateCourtParams
): Promise<ActionResponse<Court>> {
  const validationResult = await action({
    params,
    schema: UpdateCourtSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { id, ...updateData } = validationResult.params!;

  try {
    // Check if court exists
    const existingCourt = await Court.findById(id);
    if (!existingCourt) {
      return { success: false, error: { message: "Court not found" } };
    }

    // If name or location is being updated, check for duplicates
    if (updateData.name || updateData.location) {
      const duplicateCourt = await Court.findOne({
        name: updateData.name || existingCourt.name,
        location: updateData.location || existingCourt.location,
        _id: { $ne: id },
      });

      if (duplicateCourt) {
        return {
          success: false,
          error: { message: "Court with this name and location already exists" },
        };
      }
    }

    const updatedCourt = await Court.findByIdAndUpdate(
      id,
      { ...updateData },
      { new: true, runValidators: true }
    );

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedCourt)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteCourt(
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
    const court = await Court.findById(id);
    if (!court) {
      return { success: false, error: { message: "Court not found" } };
    }

    await Case.updateMany(
      { courtId: id },
      { status: "unassigned", courtId: null }
    );

    const deletedCourt = await Court.findByIdAndDelete(id);
    if (!deletedCourt) {
      return { success: false, error: { message: "Failed to delete court" } };
    }

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
} 