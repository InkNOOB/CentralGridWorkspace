import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { inviteCode, userId } = await req.json();

    const cleanCode = inviteCode?.trim();

    // 1. find board
    const board = await prisma.board.findFirst({
      where: { inviteCode: cleanCode },
    });

    if (!board) {
      return Response.json(
        { error: "Invalid invite code" },
        { status: 404 }
      );
    }

    const numericUserId = Number(userId);

    // 2. prevent owner from joining own board
    if (board.ownerId === numericUserId) {
      return Response.json(
        { error: "You cannot join your own board" },
        { status: 400 }
      );
    }

    // 3. check if already a member
    const existing = await prisma.boardMember.findFirst({
      where: {
        userId: numericUserId,
        boardId: board.id,
      },
    });

    if (existing) {
      return Response.json(
        { error: "Already joined this board" },
        { status: 400 }
      );
    }

    // 4. create membership
    const member = await prisma.boardMember.create({
      data: {
        userId: numericUserId,
        boardId: board.id,
      },
    });

    return Response.json(member);

  } catch (err) {
    console.log(err);
    return Response.json(
      { error: "Join failed" },
      { status: 500 }
    );
  }
}