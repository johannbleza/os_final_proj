import { NextResponse } from "next/server";
import { toggleTodo, deleteTodo } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todoId = parseInt(id, 10);
    if (isNaN(todoId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    toggleTodo(todoId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling todo:", error);
    return NextResponse.json(
      { error: "Failed to toggle todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todoId = parseInt(id, 10);
    if (isNaN(todoId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    deleteTodo(todoId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
