import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.username || !body.password) {
      return Response.json(
        { error: "Enter username and password" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username: body.username }
    });

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const passwordMatch = await bcrypt.compare(
      body.password,
      user.password
    );

    if (!passwordMatch) {
      return Response.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    return Response.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}