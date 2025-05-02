import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const savedScholarships = await prisma.savedScholarship.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        scholarship: true,
      },
    });

    return NextResponse.json({ scholarships: savedScholarships.map(ss => ss.scholarship) });
  } catch (error) {
    console.error('Error fetching saved scholarships:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { scholarshipId } = await req.json();

    const savedScholarship = await prisma.savedScholarship.create({
      data: {
        userId: session.user.id,
        scholarshipId,
      },
      include: {
        scholarship: true,
      },
    }) as Prisma.SavedScholarshipGetPayload<{
      include: { scholarship: true }
    }>;

    return NextResponse.json({ scholarship: savedScholarship.scholarship });
  } catch (error) {
    console.error('Error saving scholarship:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { scholarshipId } = await req.json();

    await prisma.savedScholarship.delete({
      where: {
        userId_scholarshipId: {
          userId: session.user.id,
          scholarshipId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing saved scholarship:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 