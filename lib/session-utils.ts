import { useSession } from "next-auth/react"

// Don't use the visibilitychange event as it causes too many refreshes
export async function refreshUserSession() {
  // Just wait a bit to allow any session updates to propagate
  return new Promise((resolve) => setTimeout(resolve, 500))
}

export function useUserPoints() {
  const { data: session } = useSession()
  return session?.user?.points || 0
}
