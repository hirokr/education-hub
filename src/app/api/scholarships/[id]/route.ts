import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    const scholarship = await prisma.scholarship.findUnique({
      where: {
        scholarship_id: id
      }
    });

    if (!scholarship) {
      return NextResponse.json(
        { error: 'Scholarship not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(scholarship);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch scholarship: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 