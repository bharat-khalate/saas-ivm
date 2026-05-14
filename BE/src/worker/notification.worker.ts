import { Worker } from "bullmq";
import { redisConfig } from "../config/redis.config.js";
import { resolve } from "dns";
import { join } from "path";

export const createNotificationWorker = () => {
    const worker = new Worker(
        "notification-queue",
        async (job) => {
            console.info(`Worker: Received job ${job.id}`);
            await new Promise((resolve) => setTimeout(() => {
                resolve(job);
            }, 10000))
        },
        { connection: redisConfig }
    );

    worker.on("completed", (job) => {
        console.log(`Job ${job.id} completed`);
    });

    worker.on("failed", (job, err) => {
        console.error(`Job ${job?.id} failed`, err);
    });

    console.log("Notification worker started");

    return worker;
};