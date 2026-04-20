import connectDB from "./db";
import { Board, Column } from "./models";

const DEFAULT_COLUMNS = [
  {
    name: "Wish List",
    order: 0,
  },
  {
    name: "Applied",
    order: 1,
  },
  {
    name: "Interviewing",
    order: 2,
  },
  {
    name: "Offers",
    order: 3,
  },
  {
    name: "Rejected ",
    order: 4,
  },
];

export async function InitializeUserBoard(userId: string) {
  try {
    await connectDB();

    //Check ifboard already exists for the user
    const existingBoard = await Board.findOne({ userId, name: "Job Hunt" });
    if (existingBoard) {
      return existingBoard;
    }

    //create a board
    const board = await Board.create({
      name: "Job Hunt",
      userId,
      columns: [],
    });

    //create default columns

    const columns = await Promise.all(
      DEFAULT_COLUMNS.map((col) =>
        Column.create({
          name: col.name,
          order: col.order,
          boardId: board._id,
          userId,
          jobApplications: [],
        }),
      ),
    );

    //update the board with the created columns

    board.columns = columns.map((col) => col._id);

    await board.save();

    return board;

  } catch (error) {
    throw error;
  }
}
