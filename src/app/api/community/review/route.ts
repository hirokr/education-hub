import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch all reviews
export async function GET() {
  try {
    const reviews = await prisma.review.findMany();
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST: Create a new review
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, category, rating, authorId } = body;
    console.log("Creating review with body:", body);
    

    if (!title || !content || !category || !rating || !authorId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newReview = await prisma.review.create({
      data: {
        title,
        content,
        category,
        rating,
        authorId,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
