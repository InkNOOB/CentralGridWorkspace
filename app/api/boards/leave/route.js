import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { userId, boardId } = await req.json();

    // check if owner (cannot leave)
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (board.ownerId === userId) {
      return Response.json(
        { error: "Owner cannot leave. Delete board instead." },
        { status: 400 }
      );
    }

    await prisma.boardMember.deleteMany({
      where: {
        userId,
        boardId,
      },
    });

    return Response.json({ message: "Left board" });
  } catch (err) {
    return Response.json(
      { error: "Leave failed" },
      { status: 500 }
    );
  }
}