import cron from 'node-cron';
import { notificationLogger } from '../logger/logger.js';
import { sendNotification } from '../queue/notification.queue.js';
import { getLowStockProducts } from '../service/products.service.js';
import { createNotificationContext } from '../midddleware/notification.context.middleware.js';
import { getNotificationContext } from '../logger/notification.context.js';


export const createNotificationJob = async () => {
    cron.schedule('*/10 * * * * *', async () => {
        createNotificationContext(notificationJobLogic)
    })
}

export const notificationJobLogic = async () => {
    try {
        notificationLogger.info("notification cron job: checking low stock products");
        const data = await getLowStockProducts();
        notificationLogger.info("notification cron job: pushing notification to each user");
        for (const entry of data) {
            if (!entry.user) continue;
            try {
                notificationLogger.info("notification cron job: pushing notification to email", {
                    user: entry.user.email
                });
                const { _logContext } = getNotificationContext() || { _logContext: "" };
                await sendNotification({ user: entry.user, products: entry.products, _logContext });
            } catch (err: any) {
                notificationLogger.info("notification cron job: failed pushing notification to email", {
                    user: entry.user.email,
                    error: err.message,
                    trace: err.stack
                });
            }
        }
    } catch (error: any) {
        notificationLogger.error("notification cron job: failed to fetch low stock products", {
            error: error.message,
            trace: error.stack
        });
    }
}