"use server";

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
  return { data: JSON.parse(JSON.stringify(jobApplication)) };
}
