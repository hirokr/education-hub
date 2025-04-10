"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <Button
      onClick={() =>
        signIn("credentials", {
          email: "hirokr0625@gmail.com",
          password: "12345678",
          redirect: false,
        })
      }
    >
      Sign In
    </Button>
  );
}
