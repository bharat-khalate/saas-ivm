import { RedisOptions } from "ioredis";
import { REDIS_HOST, REDIS_PORT } from "./env.js";

export const redisConfig: RedisOptions = {
    host: REDIS_HOST,
    port: REDIS_PORT
}