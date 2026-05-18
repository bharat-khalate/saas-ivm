import { AsyncLocalStorage } from "node:async_hooks";
type store = {
    _logContext: {
        requestId: string
    }
}

export const asyncLocalStorage = new AsyncLocalStorage<store>();
export const getRequestContext = () => {
    return asyncLocalStorage.getStore();
}