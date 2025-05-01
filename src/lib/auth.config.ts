import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default {
  providers: [
    GitHub,
    Google,
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (
        credentials: Partial<Record<"email" | "password", unknown>>
      ) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        console.log(email);
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user || !user?.email) return null;

        const isValid = await bcrypt.compare(
          typeof credentials.password === "string" ? credentials.password : "",
          typeof user.password === "string" ? user.password : ""
        );

        if (!isValid) return null;

        return user;
      },
    }),
  ],
  callbacks: {},
} satisfies NextAuthConfig;
