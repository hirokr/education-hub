import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId, itemId, type, value } = await req.json();

  if (!userId || !itemId || !type || ![1, -1].includes(value)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.value === value) {
        // Remove vote if same value clicked again
        await prisma.vote.delete({
          where: {
            id: existingVote.id,
          },
        });
        return NextResponse.json({ vote: null });
      } else {
        // Update vote if different
        const updated = await prisma.vote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            value,
          },
        });
        return NextResponse.json({ vote: updated });
      }
    } else {
      const newVote = await prisma.vote.create({
        data: {
          userId,
          itemId,
          type,
          value,
        },
      });
      return NextResponse.json({ vote: newVote });
    }
  } catch (err) {
    console.error("Vote error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



