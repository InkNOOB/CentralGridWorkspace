import { prisma } from "@/lib/prisma";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const id = Number(params.id);

    // 1. Get the logged-in user's ID from our frontend header
    const userIdHeader = request.headers.get("x-user-id");
    if (!userIdHeader) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = Number(userIdHeader);

    if (isNaN(id)) {
      return Response.json({ error: "Invalid board id" }, { status: 400 });
    }

    // 2. Find the board ONLY if the user owns it OR is a member of it
    const board = await prisma.board.findFirst({
      where: {
        id: id,
        OR: [
          { ownerId: userId },
          { members: { some: { userId: userId } } }
        ]
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    // 3. If no matching board is found, it means the board doesn't exist OR they don't belong to it
    if (!board) {
      return Response.json(
        { error: "Access Denied. You are not a member of this board." },
        { status: 403 }
      );
    }

    return Response.json(board);

  } catch (err) {
    console.log("GET BOARD ERROR:", err);
    return Response.json({ error: "Failed to fetch board data" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    console.log("PARAMS:", params);

    const boardId = Number(params.id);
    console.log("BOARD ID:", boardId);

    if (isNaN(boardId)) {
      return Response.json(
        { error: "Invalid board id" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));

    if (isNaN(userId)) {
      return Response.json(
        { error: "Invalid userId" },
        { status: 400 }
      );
    }

    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
      },
    });

    if (!board) {
      return Response.json(
        { error: "Board not found" },
        { status: 404 }
      );
    }

    if (board.ownerId !== userId) {
      return Response.json(
        { error: "Only owner can delete board" },
        { status: 403 }
      );
    }

    // delete members first
    await prisma.boardMember.deleteMany({
      where: {
        boardId,
      },
    });

    // delete board
    await prisma.board.delete({
      where: {
        id: boardId,
      },
    });

    return Response.json({
      message: "Deleted successfully",
    });

  } catch (err) {
    console.log("DELETE ERROR:", err);

    return Response.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}