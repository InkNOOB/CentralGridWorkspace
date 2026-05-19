import { prisma } from "@/lib/prisma";


async function getLoggedInUserId(req) {
  const userIdHeader = req.headers.get("x-user-id");
  return userIdHeader ? Number(userIdHeader) : 1;
}

// 1. GET PROFILE WITH EXCLUSIVELY NAME & BOARDS
export async function GET(req) {
  try {
    const userId = await getLoggedInUserId(req);

    if (!userId || isNaN(userId)) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        boards: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!userProfile) {
      return Response.json({ error: "User profile not found" }, { status: 404 });
    }

    return Response.json({
      id: userProfile.id,
      name: userProfile.username,
      boards: userProfile.boards,
    });
  } catch (error) {
    console.error("GET Profile Error:", error);
    return Response.json({ error: "Failed to fetch profile data" }, { status: 500 });
  }
}

// 2. DELETE PROFILE 
export async function DELETE(req) {
  try {
    const userId = await getLoggedInUserId(req);

    if (!userId || isNaN(userId)) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return Response.json({ success: true, message: "Account wiped cleanly." });
  } catch (error) {
    console.error("DELETE Profile Error:", error);
    return Response.json({ error: "Failed to delete account" }, { status: 500 });
  }
}