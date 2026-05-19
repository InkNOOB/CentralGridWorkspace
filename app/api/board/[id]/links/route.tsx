import { prisma } from "@/lib/prisma";

// GET ALL LINKS FOR THE BOARD
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const boardId = Number(id);

    if (isNaN(boardId)) {
      return Response.json({ error: "Invalid board id" }, { status: 400 });
    }

    const links = await prisma.boardLink.findMany({
      where: { boardId },
      orderBy: { createdAt: "asc" },
    });

    return Response.json(links);
  } catch (error) {
    console.error("GET Links Error:", error);
    return Response.json({ error: "Failed to fetch links" }, { status: 500 });
  }
}

// ADD A NEW LINK
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const boardId = Number(id);
    const body = await req.json();

    if (!body.title || !body.url) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const link = await prisma.boardLink.create({
      data: {
        title: body.title,
        url: body.url,
        boardId: boardId,
      },
    });

    return Response.json(link);
  } catch (error) {
    console.error("POST Link Error:", error);
    return Response.json({ error: "Failed to add link" }, { status: 500 });
  }
}

// DELETE A LINK
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // We get the linkId from the URL query, e.g., ?linkId=123
    const { searchParams } = new URL(req.url);
    const linkId = Number(searchParams.get("linkId"));

    if (isNaN(linkId)) {
      return Response.json({ error: "Invalid link id" }, { status: 400 });
    }

    await prisma.boardLink.delete({
      where: { id: linkId },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE Link Error:", error);
    return Response.json({ error: "Failed to delete link" }, { status: 500 });
  }
}