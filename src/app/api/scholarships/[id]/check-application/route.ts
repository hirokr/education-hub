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

    const application = await prisma.scholarshipApplication.findFirst({
      where: {
        userId: session.user.id,
        scholarship: {
          OR: [
            { id: params.id },
            { scholarship_id: params.id }
          ]
        }
      }
    });

    return NextResponse.json({ hasApplied: !!application });
  } catch (error) {
    console.error('Error checking scholarship application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 