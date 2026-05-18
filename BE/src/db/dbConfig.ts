import { PrismaClient } from "../../generated/prisma/index.js";
import { dbLogger } from "../logger/logger.js";

// With engineType = "library" in prisma/schema.prisma, we can use PrismaClient
// in a normal Node backend without any adapter/accelerateUrl options.
export const prisma = new PrismaClient().$extends({
  query: {
    async $allOperations({ model, operation, args, query }) {
      const logPayload = {
        type: "DATABASE",
        model,
        operation,
        timestamp: new Date().toISOString(),
      };
      dbLogger.info("Db Logger: Starting db operation", {
        logPayload
      });
      const start = Date.now()
      try {
        const result = await query(args);
        const duration = Date.now() - start;

        dbLogger.info("DB logger: ", {
          duration
        });
        return result;
      } catch (error) {
        dbLogger.error("DB Logger: Operation failed", {
          type: "DATABASE_ERROR",
          model,
          operation,
          error,
          message: "Database query failed",
        });
        throw error;
      }
    },
  },
});