// /api/community/reply/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../../prisma-client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { content, authorId, discussionId, parentId } = body;

  if (!content || !authorId || !discussionId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const reply = await prisma.reply.create({
    data: {
      content,
      authorId,
      discussionId,
      parentId: parentId || null,
    },
    include: {
      author: true,
      children: true,
    },
  });

  return NextResponse.json(reply);
}

// ⬇️ Recursive fetch function
interface ReplyWithChildren {
  id: string;
  content: string;
  authorId: string;
  discussionId: string;
  parentId: string | null;
  createdAt: Date;
  author: any; // Replace `any` with the actual author type if available
  children: ReplyWithChildren[];
}

async function getRepliesWithChildren(
  parentId: string | null,
  discussionId: string
): Promise<ReplyWithChildren[]> {
  const replies = await prisma.reply.findMany({
    where: {
      discussionId,
      parentId,
    },
    include: {
      author: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const nested: ReplyWithChildren[] = await Promise.all(
    replies.map(async (reply) => ({
      ...reply,
      children: await getRepliesWithChildren(reply.id, discussionId),
    }))
  );

  return nested;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const discussionId = searchParams.get("discussionId");

  if (!discussionId) {
    return NextResponse.json(
      { error: "Missing discussionId" },
      { status: 400 }
    );
  }

  const replies = await getRepliesWithChildren(null, discussionId);

  return NextResponse.json(replies);
}
