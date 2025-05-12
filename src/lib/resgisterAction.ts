"use server"
import { hash } from "bcryptjs";
import { z } from "zod";
import { registerSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";


export async function registerUser(data: z.infer<typeof registerSchema>) {
  const { name, email, password } = registerSchema.parse(data);

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {email},
  }); 

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash the password
  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  return { success: true, userId: user.id };
}
