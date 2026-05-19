import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();

    // 1. Validate input
    if (!body.username || !body.password) {
      return Response.json(
        { error: "Enter a username and password" },
        { status: 400 }
      );
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // 3. Create user
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: hashedPassword,
      },
    });

    // 4. Success response
    return Response.json({
      id: user.id,
      username: user.username,
    });

  } catch (error) {
    console.error("REGISTRATION_ERROR:", error);

    // 5. Handle duplicate username error
    if (error.code === "P2002") {
      return Response.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    // 6. Fallback error
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}