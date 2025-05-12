import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: {
        posted_on: 'desc'
      }
    });
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch jobs: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

