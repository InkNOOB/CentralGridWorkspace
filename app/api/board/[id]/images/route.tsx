import { prisma } from "@/lib/prisma";

export const maxDuration = 60;

// 1. GET ALL IMAGES FOR A BOARD (OR STREAM A SPECIFIC IMAGE)
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const boardId = Number(id);

    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get("imageId");

    // IF AN IMAGE ID IS PASSED, STREAM THE RAW BLOB PIXELS
    if (imageId) {
      const imgRecord = await prisma.boardImage.findUnique({
        where: { id: Number(imageId) },
      });

      if (!imgRecord) {
        return Response.json({ error: "Image not found" }, { status: 404 });
      }

      // Convert the binary buffer back into an image stream the browser can paint
      return new Response(imgRecord.imageData, {
        headers: {
          "Content-Type": imgRecord.type,
          "Content-Length": imgRecord.size.toString(),
          "Cache-Control": "public, max-age=31536000, immutable" // Speeds up loading!
        },
      });
    }

    // OTHERWISE, FETCH THE GALLERY LIST METADATA (Excludes heavy data for speed)
    const imagesList = await prisma.boardImage.findMany({
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

    return Response.json(imagesList);
  } catch (error) {
    console.error("GET Images Error:", error);
    return Response.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

// 2. UPLOAD IMAGE TO MYSQL LONGBLOB
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
      return Response.json({ error: "No image file discovered" }, { status: 400 });
    }

    // Convert raw browser file directly into a backend database Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const savedImage = await prisma.boardImage.create({
      data: {
        name: file.name,
        type: file.type,
        size: file.size,
        imageData: buffer, // Shove binary directly into the LONGBLOB
        boardId: boardId,
      },
      select: {
        id: true,
        name: true,
        size: true,
        type: true,
      },
    });

    return Response.json(savedImage);
  } catch (error) {
    console.error("POST Image Error:", error);
    return Response.json({ error: "Database storage failed" }, { status: 500 });
  }
}

// 3. REMOVE AN IMAGE
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const imageId = Number(searchParams.get("imageId"));

    if (isNaN(imageId)) {
      return Response.json({ error: "Invalid image id" }, { status: 400 });
    }

    await prisma.boardImage.delete({
      where: { id: imageId },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE Image Error:", error);
    return Response.json({ error: "Failed to delete image entry" }, { status: 500 });
  }
}