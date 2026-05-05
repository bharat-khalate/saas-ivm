import { createNotificationJob } from "./notification.cron.job.js";

interface ICronJobs {
    notiFicationJob: () => Promise<void>
}


export function createCronJobs(): ICronJobs {
    return {
        notiFicationJob: async () => {
            try {
                return createNotificationJob();
            } catch (error: any) {
                console.error("Cron failed:", error);
            }
        },
    
    }
}

export const initializeCronJobs = async () => {
    const jobs = createCronJobs();
    await jobs.notiFicationJob();
}