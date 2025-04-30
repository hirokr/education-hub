import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const appliedJobs = await prisma.jobApplication.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        job: true,
      },
    });

    return NextResponse.json({ applications: appliedJobs });
  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
