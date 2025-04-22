import { PrismaClient } from '@prisma/client'
import scholarshipsData from '@/data/scholarships.json'
import jobsData from '@/data/jobs.json'

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    // Clear existing data
    await prisma.scholarship.deleteMany()
    await prisma.job.deleteMany()

    // Seed scholarships
    const scholarships = scholarshipsData.map(scholarship => ({
      scholarship_id: scholarship.scholarship_id,
      title: scholarship.title,
      sponsor: scholarship.sponsor,
      description: scholarship.description,
      deadline: new Date(scholarship.deadline),
      amount: scholarship.amount,
      eligibility: scholarship.eligibility,
      location: scholarship.location,
      tags: scholarship.tags,
      posted_on: new Date(scholarship.posted_on)
    }))

    await prisma.scholarship.createMany({
      data: scholarships
    })

    console.log('Scholarships seeded successfully')

    // Seed jobs
    const jobs = jobsData.map(job => ({
      job_id: job.job_id,
      job_title: job.job_title,
      company_name: job.company_name,
      company_logo: job.company_logo,
      date: new Date(job.date),
      location: job.location,
      position: job.position,
      salary_range: job.salary_range,
      job_tags: job.job_tags,
      job_description: job.job_description,
      posted_on: new Date(job.posted_on),
      deadline: new Date(job.deadline)
    }))

    await prisma.job.createMany({
      data: jobs
    })

    console.log('Jobs seeded successfully')

  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()
