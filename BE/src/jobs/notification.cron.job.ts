import cron from 'node-cron';
import { sendNotification } from '../queue/notification.queue.js';
import { getLowStockProducts } from '../service/products.service.js';
import { Product, User } from '../../generated/prisma/index.js';


export const createNotificationJob = async () => {
    cron.schedule('*/10 * * * * *', async () => {
        console.info("cron running: checking low stock products");
        const data = await getLowStockProducts();
        console.log("pushing notification to each user");
        // console.log(data[0].result)
        for (const entry of data) {
            if (!entry.user) continue;
            try {
                await sendNotification({ user: entry.user, products: entry.products });
            } catch (err) {
                console.error(`Failed for user ${entry.user.userId}`, err);
            }
        }
        console.log("All notifications processed");
    })
}
