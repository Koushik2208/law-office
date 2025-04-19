"use server";

import action from "../handlers/action";
import Hearing from "@/database/hearing.model";
import { revalidatePath } from "next/cache";
import Case from "@/database/case.model";
import { FilterQuery } from "mongoose";
import {
  HearingSchema,
  CreateHearingSchema,
  UpdateHearingSchema,
  IdSchema,
} from "../validations";

export async function getHearings(
  params: GetHearingsParams
): Promise<
  ActionResponse<{
    hearings: Hearing[];
    total: number;
    page: number;
    pageSize: number;
  }>
> {
  const validationResult = await action({
    params,
    schema: HearingSchema,
  });

  if (validationResult instanceof Error) {
    return {
      success: false,
      error: { message: validationResult.message },
    };
  }

  const {
    page = 1,
    pageSize = 10,
    caseId,
    caseNumber,
    startDate,
    endDate,
  } = validationResult.params!;
  const skip = (page - 1) * pageSize;

  try {
    const filterQuery: FilterQuery<typeof Hearing> = {};

    if (caseId) {
      filterQuery.caseId = caseId;
    } else if (caseNumber) {
      const caseDoc = await Case.findOne({ caseNumber });
      if (caseDoc) {
        filterQuery.caseId = caseDoc._id;
      }
    }

    if (startDate && endDate) {
      filterQuery.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const hearings = await Hearing.find(filterQuery)
      .populate("caseId", "caseNumber title clientName")
      .skip(skip)
      .limit(pageSize)
      .sort({ date: -1 });

    const total = await Hearing.countDocuments(filterQuery);

    return {
      success: true,
      data: {
        hearings: JSON.parse(JSON.stringify(hearings)),
        total,
        page,
        pageSize,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "An error occurred",
      },
    };
  }
}

export async function getHearingById(
  params: IdParams
): Promise<ActionResponse<Hearing>> {
  const validationResult = await action({
    params,
    schema: IdSchema,
  });

  if (validationResult instanceof Error) {
    return {
      success: false,
      error: { message: validationResult.message },
    };
  }

  const { id } = validationResult.params!;

  try {
    const hearing = await Hearing.findById(id).populate(
      "caseId",
      "caseNumber title clientName"
    );
    if (!hearing) {
      return {
        success: false,
        error: { message: "Hearing not found" },
      };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(hearing)),
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "An error occurred",
      },
    };
  }
}

export async function createHearing(
  params: CreateHearingParams
): Promise<ActionResponse<Hearing>> {
  const validationResult = await action({
    params,
    schema: CreateHearingSchema,
  });

  if (validationResult instanceof Error) {
    return {
      success: false,
      error: { message: validationResult.message },
    };
  }

  const { caseNumber, date, description } = validationResult.params!;

  try {
    // Find case by caseNumber
    const caseDoc = await Case.findOne({ caseNumber });
    if (!caseDoc) {
      return {
        success: false,
        error: { message: "Case not found" },
      };
    }

    const hearing = await Hearing.create({
      caseId: caseDoc._id,
      date,
      description,
    });

    // Update case's hearingIds
    await Case.findByIdAndUpdate(caseDoc._id, {
      $push: { hearingIds: hearing._id },
    });

    const populatedHearing = await Hearing.findById(hearing._id).populate(
      "caseId",
      "caseNumber title clientName"
    );

    revalidatePath("/cases/[id]", "page");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(populatedHearing)),
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "An error occurred",
      },
    };
  }
}

export async function updateHearing(
  params: UpdateHearingParams
): Promise<ActionResponse<Hearing>> {
  const validationResult = await action({
    params,
    schema: UpdateHearingSchema,
  });

  if (validationResult instanceof Error) {
    return {
      success: false,
      error: { message: validationResult.message },
    };
  }

  const { id, ...updateData } = validationResult.params!;

  try {
    const hearing = await Hearing.findById(id);
    if (!hearing) {
      return {
        success: false,
        error: { message: "Hearing not found" },
      };
    }

    // If caseNumber is being updated, find the new case
    if (updateData.caseNumber) {
      const newCase = await Case.findOne({ caseNumber: updateData.caseNumber });
      if (!newCase) {
        return {
          success: false,
          error: { message: "New case not found" },
        };
      }

      // Remove hearing from old case's hearingIds
      await Case.findByIdAndUpdate(hearing.caseId, {
        $pull: { hearingIds: id },
      });

      // Add hearing to new case's hearingIds
      await Case.findByIdAndUpdate(newCase._id, {
        $push: { hearingIds: id },
      });

      // Create a new update object with caseId instead of caseNumber
      const updateWithCaseId = {
        ...updateData,
        caseId: newCase._id,
      };
      delete updateWithCaseId.caseNumber;

      const updatedHearing = await Hearing.findByIdAndUpdate(
        id,
        { $set: updateWithCaseId },
        { new: true }
      ).populate("caseId", "caseNumber title clientName");

      revalidatePath("/cases/[id]", "page");
      return {
        success: true,
        data: JSON.parse(JSON.stringify(updatedHearing)),
      };
    }

    // If no caseNumber update, proceed with normal update
    const updatedHearing = await Hearing.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate("caseId", "caseNumber title clientName");

    revalidatePath("/cases/[id]", "page");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedHearing)),
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "An error occurred",
      },
    };
  }
}

export async function deleteHearing(
  params: IdParams
): Promise<ActionResponse<null>> {
  const validationResult = await action({
    params,
    schema: IdSchema,
  });

  if (validationResult instanceof Error) {
    return {
      success: false,
      error: { message: validationResult.message },
    };
  }

  const { id } = validationResult.params!;

  try {
    const hearing = await Hearing.findById(id);
    if (!hearing) {
      return {
        success: false,
        error: { message: "Hearing not found" },
      };
    }

    // Remove hearing from case's hearingIds
    await Case.findByIdAndUpdate(hearing.caseId, {
      $pull: { hearingIds: id },
    });

    await Hearing.findByIdAndDelete(id);
    revalidatePath("/cases/[id]", "page");
    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "An error occurred",
      },
    };
  }
}
