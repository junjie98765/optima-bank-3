import clientPromise from "./mongodb"

export async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db("optima_rewards")
  return { client, db }
}
