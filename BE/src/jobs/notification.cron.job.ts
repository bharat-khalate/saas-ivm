import cron from 'node-cron';
import { sendNotification } from '../queue/notification.queue.js';
import { getLowStockProducts } from '../service/products.service.js';
import { Product, User } from '../../generated/prisma/index.js';


export const createNotificationJob = async () => {
    cron.schedule('*/10 * * * * *', async () => {
        console.log("cron running: checking low stock products");
        const data: { user: User | null, products: Product[] }[] = await getLowStockProducts();
        console.log(data);
        console.log("pushing notification to each user");
        await sendNotification("message");

        // for (const { user, products } of data) {
        //     if (!user) continue;
        //     try {
        //         await sendNotification({ user, products });
        //     } catch (err) {
        //         console.error(`Failed for user ${user.userId}`, err);
        //     }
        // }
        console.log("All notifications processed");
    })
}
