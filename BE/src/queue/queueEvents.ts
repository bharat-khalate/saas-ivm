import { QueueEvents } from "bullmq";
import { redisConfig } from "../config/redis.config.js";
const event = new QueueEvents('notification-queue', {
    connection: redisConfig
});
event.on('failed', ({ jobId, failedReason }) => {
    console.error(`Job ${jobId} failed: ${failedReason}`);
})