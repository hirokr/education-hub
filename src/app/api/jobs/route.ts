import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

