// pages/api/reviews.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { category } = req.query;
    let reviews;

    if (category) {
      reviews = await prisma.review.findMany({
        where: {
          category: category as string,
        },
      });
    } else {
      reviews = await prisma.review.findMany();
    }

    res.status(200).json(reviews);
  } else if (req.method === "POST") {
    const { title, content, category, rating, authorId } = req.body;

    // Validate input
    if (!title || !content || !category || !rating || !authorId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new review in the database
    try {
      const newReview = await prisma.review.create({
        data: {
          content,
          category,
          rating,
          authorId,
        },
      });
      res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json({ error: "Failed to create review" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
