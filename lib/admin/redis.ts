import { createClient, type RedisClientType } from "redis"

declare global {
  // eslint-disable-next-line no-var
  var __redisClient: RedisClientType | undefined
}

export async function getRedis() {
  if (!global.__redisClient) {
    const client = createClient({
      url: process.env.REDIS_URL,
      socket: { connectTimeout: 5000, reconnectStrategy: (retries) => (retries > 3 ? new Error("Redis unreachable") : 200) },
    })
    client.on("error", (err) => console.error("Redis Client Error", err))
    await client.connect()
    global.__redisClient = client
  }
  return global.__redisClient
}
