import { AsyncLocalStorage } from "node:async_hooks";
type TNotificationStore = {
    _logContext: {
        cronId: string
    }
}

export const asyncNotificationStorage = new AsyncLocalStorage<TNotificationStore>();

export const getNotificationContext = () => asyncNotificationStorage.getStore();