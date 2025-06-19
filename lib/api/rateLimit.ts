import { createClient } from "redis";

const redis = createClient();
await redis.connect();

const RATE_LIMIT = 10;
const WINDOW_SECONDS = 60;

export async function rateLimit(
  identifier: string,
  action?: string,
): Promise<boolean> {
  const key = `rl:${identifier}${action ? `:${action}` : ""}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }

  return current <= RATE_LIMIT;
}
