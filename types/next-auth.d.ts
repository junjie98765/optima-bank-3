import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      points: number
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    points: number
  }
}
