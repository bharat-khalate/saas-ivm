import { randomUUID } from "node:crypto";
import { asyncLocalStorage } from "../logger/request.context.js";
import { NextFunction, Request, Response } from "express";

export const requestContextMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const requestId = randomUUID();
    asyncLocalStorage.run({
        _logContext: {
            requestId
        }
    },
        () => next())
}