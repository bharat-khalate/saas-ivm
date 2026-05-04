import type { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.util.js";

type ValidationErrorDetail = {
  field: string;
  path: string;
  message: string;
  code?: string;
};

/**
 * Middleware validator for Express / API routes
 * @param schema ZodSchema to validate request body
 */
export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details: ValidationErrorDetail[] = result.error.issues.map(
        (issue) => {
          const path = issue.path
            .map((p) => (typeof p === "number" ? String(p) : p))
            .join(" -> ");
          const field =
            (issue.path[0] && String(issue.path[0])) || "unknown_field";

          // Convert camelCase / lower-case field names into nicer labels
          const prettyField = field
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (ch) => ch.toUpperCase());

          return {
            field: prettyField,
            path,
            message: issue.message,
            code: issue.code,
          };
        },
      );

      const messageArray = details.map((d) => `${d.field}: ${req.t(d.message)}`);

      // Log a concise validation summary for debugging
      console.warn("Request validation failed:", {
        path: req.originalUrl || req.path,
        method: req.method,
        errors: details,
      });

      // For validation errors, respond with an array of human-readable messages
      // and no separate error payload, as expected by the frontend.
      return res.status(400).json({
        success: false,
        message: messageArray.length ? messageArray : ["Validation failed"],
      });
    }

    // Replace body with validated data
    req.body = result.data;
    next();
  };
}