import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const scholarships = await prisma.scholarship.findMany({
      orderBy: {
        posted_on: 'desc'
      }
    });

    return NextResponse.json(scholarships);
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scholarships' },
      { status: 500 }
    );
  }
} 