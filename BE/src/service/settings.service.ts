import { prisma } from "../db/dbConfig.js";

/**
 * Returns settings for organization, creating defaults when absent.
 * @param {number} organizationId - Organization identifier.
 * @returns {Promise<import("../../generated/prisma/index.js").Settings>} Settings row.
 */
export const getOrCreateSettingsForOrg = async (organizationId: number) => {
  const existing = await prisma.settings.findUnique({
    where: { organizationId },
  });

  if (existing) return existing;

  return prisma.settings.create({
    data: {
      organizationId,
      defaultLowStockThreshold: 5,
    },
  });
};

/**
 * Returns settings for organization if present.
 * @param {number} organizationId - Organization identifier.
 * @returns {Promise<import("../../generated/prisma/index.js").Settings | null>} Settings or null.
 */
export const getSettingsForOrg = async (organizationId: number) => {
  return prisma.settings.findUnique({
    where: { organizationId },
  });
};

/**
 * Creates or updates settings for organization.
 * @param {number} organizationId - Organization identifier.
 * @param {number | null} defaultLowStockThreshold - Threshold value or null.
 * @returns {Promise<import("../../generated/prisma/index.js").Settings>} Upserted settings row.
 */
export const upsertSettingsForOrg = async (
  organizationId: number,
  defaultLowStockThreshold: number | null,
) => {
  return prisma.settings.upsert({
    where: { organizationId },
    create: {
      organizationId,
      defaultLowStockThreshold,
    },
    update: {
      defaultLowStockThreshold,
    },
  });
};


