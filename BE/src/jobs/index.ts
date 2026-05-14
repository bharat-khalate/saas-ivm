import { createNotificationJob } from "./notification.cron.job.js";

interface ICronJobs {
    notiFicationJob: () => Promise<void>
}
export const cronJobs: ICronJobs = {

    notiFicationJob: async () => {
        try {
            return createNotificationJob();
        } catch (error: any) {
            console.error("Cron failed:", error);
        }
    },

}

export const initializeCronJobs = async () => {
    await cronJobs.notiFicationJob();
}