import clientPromise from "./mongodb"

export async function connectToDatabase() {
  try {
    const client = await clientPromise
    const db = client.db("optima_rewards")
    return { client, db }
  } catch (error) {
    console.error("Failed to connect to database:", error)
    throw new Error(`Database connection failed: ${error.message}`)
  }
}
