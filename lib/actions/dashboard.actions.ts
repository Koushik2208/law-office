"use server";

import dbConnect from "@/lib/mongoose";
import Case from "@/database/case.model";
import Hearing from "@/database/hearing.model";
import logger from "@/lib/logger";
import { formatDate } from "@/lib/utils";

// Get basic statistics for the cards
export async function getDashboardStats() {
  try {
    await dbConnect();
    logger.info("Fetching dashboard stats");

    const [caseStats, hearingStats] = await Promise.all([
      Case.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: {
              $sum: {
                $cond: [{ $eq: ["$status", "pending"] }, 1, 0]
              }
            }
          }
        }
      ]),
      Hearing.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            upcoming: {
              $sum: {
                $cond: [{ $gte: ["$date", formatDate(new Date())] }, 1, 0]
              }
            }
          }
        }
      ])
    ]);

    return {
      totalCases: caseStats[0]?.total || 0,
      activeCases: caseStats[0]?.active || 0,
      totalHearings: hearingStats[0]?.total || 0,
      upcomingHearings: hearingStats[0]?.upcoming || 0,
    };
  } catch (error) {
    logger.error({ error }, "Error fetching dashboard stats");
    throw error;
  }
}

// Get recent cases
export async function getRecentCases() {
  try {
    await dbConnect();
    logger.info("Fetching recent cases");

    const cases = await Case.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("lawyerId", "name")
      .populate("courtId", "name");

    return JSON.parse(JSON.stringify(cases));
  } catch (error) {
    logger.error({ error }, "Error fetching recent cases");
    throw error;
  }
}

// Get upcoming hearings
export async function getUpcomingHearings() {
  try {
    await dbConnect();
    logger.info("Fetching upcoming hearings");

    const hearings = await Hearing.find({ date: { $gte: formatDate(new Date()) } })
      .sort({ date: 1 })
      .limit(5)
      .populate("caseId", "title caseNumber");

    return JSON.parse(JSON.stringify(hearings));
  } catch (error) {
    logger.error({ error }, "Error fetching upcoming hearings");
    throw error;
  }
}

// Get case status distribution
export async function getCaseStatusDistribution() {
  try {
    await dbConnect();
    logger.info("Fetching case status distribution");

    const statuses = await Case.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    return statuses;
  } catch (error) {
    logger.error({ error }, "Error fetching case status distribution");
    throw error;
  }
}

// Get hearings by month
export async function getHearingsByMonth() {
  try {
    await dbConnect();
    logger.info("Fetching hearings by month");

    const monthlyData = await Hearing.aggregate([
      {
        $match: {
          date: { $exists: true, $ne: null }
        }
      },
      {
        $addFields: {
          month: { $month: { $toDate: "$date" } }
        }
      },
      {
        $group: {
          _id: "$month",
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    return monthlyData;
  } catch (error) {
    logger.error({ error }, "Error fetching hearings by month");
    throw error;
  }
} 