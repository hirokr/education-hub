import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const appliedScholarships = await prisma.scholarshipApplication.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        scholarship: true,
      },
    });

    return NextResponse.json({ applications: appliedScholarships });
  } catch (error) {
    console.error('Error fetching applied scholarships:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
