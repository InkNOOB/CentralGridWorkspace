import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get("userId"));

  try {
    // owned boards
    const owned = await prisma.board.findMany({
      where: { ownerId: userId },
    });

    // joined boards
    const joined = await prisma.boardMember.findMany({
      where: { userId },
      include: {
        board: true,
      },
    });

    const joinedBoards = joined.map((b) => b.board);

    return Response.json([...owned, ...joinedBoards]);
  } catch (err) {
    return Response.json(
      { error: "Failed to load boards" },
      { status: 500 }
    );
  }
}