import { z, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.util.js";

/**
 * Middleware validator for Express / API routes
 * @param schema ZodSchema to validate request body
 */
export function validateRequest(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            // Aggregate errors into a flat array
            const aggregatedErrors = result.error.issues.map(issue => {
                // Join the path with ' -> ', handle numeric indices
                const path = issue.path
                    .map(p => (typeof p === "number" ? p : p))
                    .join(" -> ");
                return `${issue.message}`;
            });

            console.log(aggregatedErrors);
            // Return as a single string
            return sendError(
                res,
                400,
                "Validation failed",
                aggregatedErrors // combine all messages
            );

        }

        // Replace body with validated data
        req.body = result.data;
        next();
    };
}