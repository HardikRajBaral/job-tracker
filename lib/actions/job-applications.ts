"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobApplication } from "../models";

interface JobApplicationData {
  company: string;
  position: string;
  location?: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  columnId: string;
  boardId: string;
  tags?: string[];
  description?: string;
}
export async function createJobApplication(data: JobApplicationData) {
  const session = await getSession();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }
  await connectDB();

  const {
    company,
    position,
    location,
    notes,
    salary,
    boardId,
    columnId,
    jobUrl,
    tags,
    description,
  } = data;

  if (!company || !position || !boardId || !columnId) {
    return { error: "Missing required fields" };
  }

  //verify board  belong to user
  const board = await Board.findOne({
    _id: boardId,
    userId: session.user.id,
  });
  if (!board) {
    return { error: "Board not found" };
  }

  //verify column  belong to user
  const column = await Column.findOne({
    _id: columnId,
    boardId: board._id,
  });
  if (!column) {
    return { error: "column not found" };
  }

  const maxOrder = (await JobApplication.findOne({ columnId })
    .sort({ order: -1 })
    .select("order")
    .lean()) as { order: number } | null;
  const jobApplication = await JobApplication.create({
    company,
    position,
    location,
    notes,
    salary,
    boardId,
    columnId,
    jobUrl,
    tags: tags || [],
    description,
    status: "applied",
    order: maxOrder ? maxOrder.order + 1 : 0,
    userId: session.user.id,
  });

  await Column.findByIdAndUpdate(columnId, {
    $push: {
      jobApplications: jobApplication._id,
    },
  });

  revalidatePath("/dashboard");

  return { data: JSON.parse(JSON.stringify(jobApplication)) };
}

export async function updateJobApplication(
  id: string,
  updates: {
    company?: string;
    position?: string;
    location?: string;
    notes?: string;
    salary?: string;
    jobUrl?: string;
    columnId?: string;
    order?: number;
    tags?: string[];
    description?: string;
  },
) {
  const session = await getSession();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }
  const jobApplication = await JobApplication.findOne({ id });

  if (!jobApplication) {
    return { error: "Job application not found" };
  }

  if (jobApplication.userId.toString() !== session.user.id) {
    return { error: "Unauthorized" };
  }

  const { columnId, order, ...otherUpdates } = updates;
  const updatesToApply: Partial<{
    company: string;
    position: string;
    location: string;
    notes: string;
    salary: string;
    jobUrl: string;
    columnId: string;
    order: number;
    tags: string[];
    description: string;
  }> = otherUpdates;

  const currentColumnId = jobApplication.columnId.toString();
  const newColumnId = columnId;

  const isMovingToDifferentColumn =
    newColumnId && newColumnId !== currentColumnId;

  if (isMovingToDifferentColumn) {
    await Column.findByIdAndUpdate(currentColumnId, {
      $pull: { jobApplications: id },
    });
    const jobInTargetColumn = await JobApplication.find({
      columnId: newColumnId,
      _id: { $ne: id },
    })
      .sort({ order: 1 })
      .lean();

    let newOrderValue: number;
    if (order !== undefined && order !== null) {
      newOrderValue = order * 100;

      const jobThatNeedsToShift = jobInTargetColumn.slice(order);
      for (const job of jobThatNeedsToShift) {
        await JobApplication.findByIdAndUpdate(job._id, {
          $set: { order: job.order + 100 },
        });
      }
    } else {
      if (jobInTargetColumn.length > 0) {
        const lastJobOrder =
          jobInTargetColumn[jobInTargetColumn.length - 1].order || 0;

        newOrderValue = lastJobOrder + 100;
      } else {
        newOrderValue = 0;
      }
    }
    updatesToApply.columnId = newColumnId;
    updatesToApply.order = newOrderValue;
    await Column.findByIdAndUpdate(newColumnId, {
      $push: {
        jobApplications: id,
      },
    });
  } else if (order !== undefined || order !== null) {
    const otherJobInColumn = await JobApplication.find({
      columnId: currentColumnId,
      _id: { $ne: id },
    })
      .sort({ order: 1 })
      .lean();
  }
}
