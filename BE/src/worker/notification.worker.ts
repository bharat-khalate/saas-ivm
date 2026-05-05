import { Worker } from "bullmq";
import { redisConfig } from "../config/redis.config.js";

export const createNotificationWorker = () => {
    const worker = new Worker(
        "notification-queue",
        async (job) => {
            const obj = job.data;
            console.log("Worker :message sent", obj);
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