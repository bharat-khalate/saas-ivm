import { prisma } from "../db/dbConfig.js";

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

export const getSettingsForOrg = async (organizationId: number) => {
  return prisma.settings.findUnique({
    where: { organizationId },
  });
};

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


