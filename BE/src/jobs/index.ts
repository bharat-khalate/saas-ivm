import { notificationLogger } from "../logger/logger.js";
import { createNotificationJob } from "./notification.cron.job.js";

interface ICronJobs {
    notiFicationJob: () => Promise<void>
}
export const cronJobs: ICronJobs = {

    notiFicationJob: async () => {
        try {
            notificationLogger.info("Job Initializer: creating notification cron job")
            return createNotificationJob();
        } catch (error: any) {
            notificationLogger.error("Job Initializer: Cron creation failed:", {
                error: error.message,
                trace: error.stack
            });
        }
    },

}

export const initializeCronJobs = async () => {
    await cronJobs.notiFicationJob();
}