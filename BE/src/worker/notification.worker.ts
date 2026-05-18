import { Worker } from "bullmq";
import { redisConfig } from "../config/redis.config.js";
import { notificationLogger } from "../logger/logger.js";
import { createNotificationContext } from "../midddleware/notification.context.middleware.js";

export const createNotificationWorker = () => {
    const worker = new Worker(
        "notification-queue",
        async (job) => {
            createNotificationContext(async () => {
                notificationLogger.info(`Notification Worker: Received job ${job.id}`);
                await new Promise((resolve) => setTimeout(() => {
                    resolve(job);
                }, 10000))
            }, job?.data?._logContext)

        },
        { connection: redisConfig }
    );

    worker.on("completed", (job) => {
        createNotificationContext(async () => {
            notificationLogger.info(`Notification Worker: Job ${job.id} completed`);
        }, job?.data?._logContext)
    });

    worker.on("failed", (job, err) => {
        createNotificationContext(async () => {
            notificationLogger.error(`Notification Worker: Job failed`, {
                jobId: job?.id,
                error: err.message,
                trace: err.stack
            });
        }, job?.data?._logContext)
    });
    return worker;
};