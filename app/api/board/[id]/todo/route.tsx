import { prisma } from "@/lib/prisma";

// GET ALL TODOS
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const boardId = Number(id);

  if (!boardId) {
    return Response.json({ error: "Invalid boardId" }, { status: 400 });
  }

  const todos = await prisma.todo.findMany({
    where: { boardId },
    orderBy: { id: "asc" },
  });

  return Response.json(todos);
}

// ADD OR REMOVE TODO
export async function POST(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const boardId = Number(id);
  const { text } = await req.json();

  const trimmed = text?.trim();

  if (!trimmed) {
    return Response.json({ error: "Empty task" }, { status: 400 });
  }

  // Check if task exists
  const existing = await prisma.todo.findFirst({
    where: {
      boardId,
      text: {
        equals: trimmed,
      },
    },
  });

  // REMOVE if exists
  if (existing) {
    await prisma.todo.delete({
      where: { id: existing.id },
    });

    return Response.json({ action: "removed" });
  }

  // ADD if not exists
  const newTask = await prisma.todo.create({
    data: {
      boardId,
      text: trimmed,
      completed: false,
    },
  });

  return Response.json({ action: "added", task: newTask });
}

// TOGGLE CHECKBOX
export async function PATCH(req: Request) {
  const { id, completed } = await req.json();

  const updated = await prisma.todo.update({
    where: { id },
    data: {
      completed,
    },
  });

  return Response.json(updated);
}