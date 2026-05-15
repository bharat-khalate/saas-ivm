import { info } from "node:console";
import winston from "winston"
const { combine, timestamp, printf } = winston.format;
import TransportSentry from "winston-transport-sentry-node";
import { ConsoleTransportInstance, FileTransportInstance } from "winston/lib/winston/transports/index.js";
import { meta } from "zod/v4/core";
import { getRequestContext } from "./request.context.js";
import { getNotificationContext } from "./notification.context.js";
const stripAnsi = (str: string) => {
    if (typeof str !== "string") return str;
    return str.replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        "",
    )
}
/**
 * Custom Winston printf format that serialises each log entry as a JSON string
 * with ANSI colour codes stripped from the message.
 */
const customFormat = printf(({ level, message, timestamp, ...meta }) => {
    const cleanMessage = stripAnsi(String(message));
    return JSON.stringify({ level, message: cleanMessage, timestamp, ...meta });
});

export function createLogger(fileName: string = "app-info.log", context?: () => Record<string, string> | undefined) {
    const today = new Date().toISOString().split("T")[0];
    const injectContext = winston.format((info) => {
        return {
            ...(context ? context() : {}),
            ...info,
        };
    });
    const transports: Array<ConsoleTransportInstance | FileTransportInstance > = [
        new winston.transports.File({
            filename: `logs/${today}/${fileName}`,
            level: "info",
            format: combine(
                injectContext(),
                timestamp({ format: "yyyy-mm-dd hh:mm:ss.SSS A" }),
                printf((info) => {
                    const {
                        timestamp,
                        level,
                        message,
                        _logContext,
                        ...meta
                    } = info;
                    const contextString =
                        _logContext
                            ? ` [${Object.entries(_logContext)
                                .map(([k, v]) => `${k}:${v}`)
                                .join(" ")}]`
                            : "";

                    const metaString =
                        Object.keys(meta).length > 0
                            ? ` ${JSON.stringify(meta)}`
                            : "";
                    return `[${timestamp}]${contextString} ${level}: ${stripAnsi(String(message))}${metaString}`;
                })
            )
        })
    ];
    if (process.env.SENTRY_KEY) {

        transports.push(
            new TransportSentry({
                sentry: {
                    dsn: process.env.SENTRY_KEY,
                },
                level: "error",
                format: winston.format.uncolorize(),
            })
        )
    }
    if (process.env.NODE_ENV !== "production") {
        transports.push(
            new winston.transports.Console({
                level: "silly",
                format: winston.format.simple()
            })
        )
    }
    const logger = winston.createLogger({
        level: process.env.LOG_LEVEL || "info",
        transports
    })
    if (process.env.DISABLE_LOGGING === "YES") {
        logger.transports.forEach((transport) => {
            transport.silent = true;
        });
    }

    return logger;
}
export const defaultLogger = createLogger();
export const notificationLogger = createLogger("notification-info.log", getNotificationContext);
export const dbLogger = createLogger("db-info.log");
export const requestLogger = createLogger("request-info.log", getRequestContext);
export default defaultLogger;