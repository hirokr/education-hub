import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const savedJobs = await prisma.savedJob.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        job: true,
      },
    });

    return NextResponse.json({ jobs: savedJobs.map(sj => sj.job) });
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { jobId } = await req.json();

    const savedJob = await prisma.savedJob.create({
      data: {
        userId: session.user.id,
        jobId,
      },
      include: {
        job: true,
      },
    });

    return NextResponse.json({ job: savedJob.job });
  } catch (error) {
    console.error('Error saving job:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { jobId } = await req.json();

    await prisma.savedJob.delete({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing saved job:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 