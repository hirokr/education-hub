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
    // Await the params
    const { id } = await params;
    
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const academicInfo = formData.get('academicInfo') as string;
    const coverLetter = formData.get('coverLetter') as string;
    const documents = formData.get('documents') as File;

    if (!fullName || !email || !phone || !academicInfo || !coverLetter || !documents) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Save the document file
    const bytes = await documents.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${documents.name}`;
    const path = join(process.cwd(), 'public/uploads', fileName);
    await writeFile(path, buffer);

    // Find the scholarship
    const scholarship = await prisma.scholarship.findFirst({
      where: {
        OR: [
          { id: id },
          { scholarship_id: id }
        ]
      }
    });

    if (!scholarship) {
      console.error('Scholarship not found with ID:', id);
      return new NextResponse('Scholarship not found', { status: 404 });
    }

    // Create the application
    const application = await prisma.scholarshipApplication.create({
      data: {
        userId: session.user.id,
        scholarshipId: scholarship.id,
        fullName,
        email,
        phone,
        academicInfo,
        coverLetter,
        documents: `/uploads/${fileName}`,
      },
    });

    // Send confirmation email
    await sendApplicationConfirmationEmail(
      email,
      'scholarship',
      scholarship.title,
      fullName
    );

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error submitting scholarship application:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 