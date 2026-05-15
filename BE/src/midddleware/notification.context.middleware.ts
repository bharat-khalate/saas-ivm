import { randomUUID } from "node:crypto"
import { asyncNotificationStorage } from "../logger/notification.context.js";

export const createNotificationContext = (job: () => Promise<void>, context?: { cronId: string }) => {
    const id = randomUUID();
    asyncNotificationStorage.run(
        {
            _logContext: {
                cronId: context ? context.cronId : id
            }
        },
        job
    )
}