import { createClient } from "redis";

const RATE_LIMIT = 10;
const WINDOW_SECONDS = 60;

let redis: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!redis) {
    redis = createClient();
    await redis.connect();
  }
  return redis;
}

export async function rateLimit(
  identifier: string,
  action?: string,
): Promise<boolean> {
  const client = await getRedisClient();
  const key = `rl:${identifier}${action ? `:${action}` : ""}`;
  const current = await client.incr(key);

  if (current === 1) {
    await client.expire(key, WINDOW_SECONDS);
  }

  return current <= RATE_LIMIT;
}
