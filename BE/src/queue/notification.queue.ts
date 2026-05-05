import { redisConfig } from "../config/redis.config.js";
import { Queue } from "bullmq";


export const notificationQueue = new Queue('notification-queue', {
    connection: redisConfig
})

export const sendNotification = async (data: any) => {
    console.log("cron created");
    await notificationQueue.add('send-notification', data, {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 2000,
        },
        removeOnComplete: true
    })
}