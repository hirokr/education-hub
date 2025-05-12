import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
   context :{params:Promise<{ id: string }>} 
) {
  const {id} =  await context.params; 
  console.log(id);
  
 
  
  try {
    const discussion = await prisma.discussion.findUnique({
      where: { id },
      include: {
        author:{
          select: {
            name: true,
          },
        }
      }
    });
    if (!discussion) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(discussion);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching discussion", error },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { title, content } = await req.json();

  try {
    const updated = await prisma.discussion.update({
      where: { id },
      data: { title, content },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating discussion", error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const deleted = await prisma.discussion.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Deleted successfully", deleted });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting discussion", error },
      { status: 500 }
    );
  }
}

// POST typically not needed on a dynamic [id] route,
// but if you want to allow replies or nested comments, you could implement it here.
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { content, authorId } = await req.json();

  // Example: Add a comment to a discussion
  try {
    const comment = await prisma.reply.create({
      data: {
        content,
        authorId,
        discussionId: id,
      },
    });
    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json(
      { message: "Error adding comment", error },
      { status: 500 }
    );
  }
}
