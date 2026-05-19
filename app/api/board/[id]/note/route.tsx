import { prisma } from "@/lib/prisma";

// GET note
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const boardId = Number(id);

    // 1. Validate the ID
    if (isNaN(boardId)) {
      return Response.json({ error: "Invalid board ID" }, { status: 400 });
    }

    const note = await prisma.boardNote.findUnique({
      where: { boardId },
    });

    return Response.json(note || {});
    
  } catch (error) {
    // 2. Catch unexpected errors
    console.error("GET Note Error:", error);
    return Response.json({ error: "Failed to fetch note" }, { status: 500 });
  }
}

// UPDATE note
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // <-- Back to Promise!
) {
  try {
    const { id } = await params;
    const boardId = Number(id);

    if (isNaN(boardId)) {
      return Response.json({ error: "Invalid board ID" }, { status: 400 });
    }

    const body = await req.json();

    // 3. Validate the payload
    if (typeof body.content !== "string") {
      return Response.json({ error: "Content must be a string" }, { status: 400 });
    }

    const note = await prisma.boardNote.upsert({
      where: { boardId },
      update: { content: body.content },
      create: {
        boardId,
        content: body.content,
      },
    });

    return Response.json(note);

  } catch (error) {
    console.error("POST Note Error:", error);
    return Response.json({ error: "Failed to save note" }, { status: 500 });
  }
}