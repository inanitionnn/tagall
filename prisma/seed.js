import { PrismaClient } from "@prisma/client";
import { seedsData } from "./seedsData.js";
const prisma = new PrismaClient();

async function main() {
  const { collections, fieldGroups } = seedsData;
  for (const collection of collections) {
    await prisma.collection.upsert({
      where: {
        id: collection.id,
      },
      create: {
        id: collection.id,
        name: collection.name,
        priority: collection.priority,
      },
      update: {
        id: collection.id,
        name: collection.name,
        priority: collection.priority,
      },
    });
  }
  for (const fieldGroup of fieldGroups) {
    await prisma.fieldGroup.upsert({
      where: {
        id: fieldGroup.id,
      },
      create: {
        id: fieldGroup.id,
        name: fieldGroup.name,
        collections: {
          connect: fieldGroup.collections.map((collectionId) => ({
            id: collectionId,
          })),
        },
      },
      update: {
        id: fieldGroup.id,
        name: fieldGroup.name,
        collections: {
          connect: fieldGroup.collections.map((collectionId) => ({
            id: collectionId,
          })),
        },
      },
    });
  }
}

console.log("Seeding database...");
main()
  .then(async () => {
    console.log("Seed data inserted successfully.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
