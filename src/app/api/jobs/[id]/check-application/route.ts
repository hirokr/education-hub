import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const application = await prisma.jobApplication.findFirst({
      where: {
        userId: session.user.id,
        job: {
          OR: [
            { id: params.id },
            { job_id: params.id }
          ]
        }
      }
    });

    return NextResponse.json({ hasApplied: !!application });
  } catch (error) {
    console.error('Error checking job application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 