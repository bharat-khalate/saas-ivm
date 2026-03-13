import { PrismaClient } from "../../generated/prisma/index.js";

// With engineType = "library" in prisma/schema.prisma, we can use PrismaClient
// in a normal Node backend without any adapter/accelerateUrl options.
export const prisma = new PrismaClient({
  log: ["query"],
});