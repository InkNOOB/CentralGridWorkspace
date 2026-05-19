import { prisma } from "@/lib/prisma";

// 1. GET ALL FILES METADATA -OR- DOWNLOAD A SPECIFIC FILE
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const boardId = Number(id);

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");

    // IF A SPECIFIC FILE ID IS REQUESTED, TRIGGER THE DOWNLOAD STREAM
    if (fileId) {
      const fileRecord = await prisma.boardFile.findUnique({
        where: { id: Number(fileId) },
      });

      if (!fileRecord) {
        return Response.json({ error: "File not found" }, { status: 404 });
      }

      // Convert the Prisma Bytes back into a downloadable file stream
      return new Response(fileRecord.fileData, {
        headers: {
          "Content-Disposition": `attachment; filename="${fileRecord.name}"`,
          "Content-Type": fileRecord.type,
          "Content-Length": fileRecord.size.toString(),
        },
      });
    }

    // OTHERWISE, RETURN THE LIST OF METADATA (Excludes the heavy fileData for fast loading)
    const filesList = await prisma.boardFile.findMany({
      where: { boardId },
      select: {
        id: true,
        name: true,
        size: true,
        type: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(filesList);
  } catch (error) {
    console.error("GET Files Error:", error);
    return Response.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}

// 2. UPLOAD A NEW FILE TO LONGBLOB
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const boardId = Number(id);

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert raw browser file directly into a database Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const savedFile = await prisma.boardFile.create({
      data: {
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        fileData: buffer, // Pushing the full binary into the LONGBLOB
        boardId: boardId,
      },
      select: {
        id: true,
        name: true,
        size: true,
        type: true,
      },
    });

    return Response.json(savedFile);
  } catch (error) {
    console.error("POST File Error:", error);
    return Response.json({ error: "File storage failed" }, { status: 500 });
  }
}

// 3. REMOVE A FILE FROM DB
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = Number(searchParams.get("fileId"));

    if (isNaN(fileId)) {
      return Response.json({ error: "Invalid file id" }, { status: 400 });
    }

    await prisma.boardFile.delete({
      where: { id: fileId },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE File Error:", error);
    return Response.json({ error: "Failed to delete file entry" }, { status: 500 });
  }
}