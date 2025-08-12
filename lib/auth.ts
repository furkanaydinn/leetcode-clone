import { PrismaClient } from "@prisma/client"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"

const prisma = new PrismaClient()

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  secret: process.env.AUTH_SECRET || "your-secret-key-here-change-in-production",
  baseURL: process.env.AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  pages: {
    signIn: "/auth/login"
  }
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user 