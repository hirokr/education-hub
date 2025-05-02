import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { sendApplicationConfirmationEmail } from '@/lib/email';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const job = await prisma.job.findFirst({
      where: {
        OR: [
          { id: id },
          { job_id: id }
        ]
      }
    });

    if (!job) {
      console.error('Job not found with ID:', id);
      return new NextResponse('Job not found', { status: 404 });
    }

    const formData = await request.formData();
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const coverLetter = formData.get('coverLetter') as string;
    const resume = formData.get('resume') as File;

    if (!fullName || !email || !phone || !coverLetter || !resume) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Save the resume file
    const bytes = await resume.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${resume.name}`;
    const path = join(process.cwd(), 'public/uploads', fileName);
    await writeFile(path, buffer);

    // Create the application
    const application = await prisma.jobApplication.create({
      data: {
        userId: session.user.id,
        jobId: job.id,
        fullName,
        email,
        phone,
        coverLetter,
        resume: `/uploads/${fileName}`,
      },
    });

    // Send confirmation email
    await sendApplicationConfirmationEmail(
      email,
      'job',
      job.job_title,
      fullName
    );

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error submitting job application:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 