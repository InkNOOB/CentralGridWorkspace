import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get("userId"));

    // 🟦 CREATED BOARDS
    const created = await prisma.board.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    // 🟩 JOINED BOARDS
    const joined = await prisma.boardMember.findMany({
      where: {
        userId: userId,
      },
      include: {
        board: {
          include: {
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
      },
    });

    return Response.json({
      created,
      joined: joined.map(j => j.board),
    });

  } catch (err) {
    console.log(err);
    return Response.json(
      { error: "Failed to load boards" },
      { status: 500 }
    );
  }
}



// CREATE BOARD
export async function POST(req) {
  const body = await req.json();

  const board = await prisma.board.create({
    data: {
      title: body.title,
      ownerId: body.ownerId,
      inviteCode: Math.random().toString(36).substring(2, 8),
    },
  });

  return Response.json(board);
}