import { createNotificationWorker } from "./notification.worker.js";

export const initializeWorkers = () => {
    createNotificationWorker();
};