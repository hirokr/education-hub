import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const scholarships = await prisma.scholarship.findMany({
      orderBy: {
        posted_on: 'desc'
      }
    });
    return NextResponse.json(scholarships);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch scholarships: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

