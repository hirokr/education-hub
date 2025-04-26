import nodemailer from 'nodemailer';

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  throw new Error('Email credentials are not properly configured in environment variables');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify the transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('Email transporter verification failed:', error);
  } else {
    console.log('Email transporter is ready to send emails');
  }
});

export async function sendApplicationConfirmationEmail(
  to: string,
  type: 'job' | 'scholarship',
  title: string,
  applicantName: string
) {
  if (!to || !title || !applicantName) {
    console.error('Missing required parameters for sending confirmation email');
    return false;
  }

  const subject = `Application Confirmation - ${type === 'job' ? 'Job' : 'Scholarship'} Application`;
  const text = `
    Dear ${applicantName},

    Thank you for submitting your application for ${title}.
    We have received your application and will review it shortly.

    Best regards,
    Education Hub Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Application Confirmation</h2>
      <p>Dear ${applicantName},</p>
      <p>Thank you for submitting your application for <strong>${title}</strong>.</p>
      <p>We have received your application and will review it shortly.</p>
      <p>Best regards,<br>Education Hub Team</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Education Hub" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
} 