import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user?: {
      id?: number
      username?: string | null | undefined
    } & DefaultSession["user"]
  }

  interface User {
    id?: number
    username?: string | null | undefined
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: number
    username?: string | null | undefined
  }
}