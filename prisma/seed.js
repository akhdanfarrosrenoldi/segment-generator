require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.connection.deleteMany();
  await prisma.port.deleteMany();
  await prisma.node.deleteMany();
  
  await prisma.node.createMany({
    data: [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
      { id: 7 },
      { id: 8 },
      { id: 9 },
      { id: 10 },
      { id: 11 },
      { id: 12 },
    ],
  });

  await prisma.port.createMany({
  data: [
    { id: "1a", nodeId: 1, value: 100 },

    { id: "2a", nodeId: 2, value: 90 },
    { id: "2b", nodeId: 2, value: 130 },

    { id: "3a", nodeId: 3, value: 150 },

    { id: "4a", nodeId: 4, value: 70 },

    { id: "5a", nodeId: 5, value: 160 },

    { id: "6a", nodeId: 6, value: null },
    { id: "6b", nodeId: 6, value: null },
    { id: "6c", nodeId: 6, value: null },

    { id: "7a", nodeId: 7, value: null },
    { id: "7b", nodeId: 7, value: null },
    { id: "7c", nodeId: 7, value: null },

    { id: "8a", nodeId: 8, value: 200 },

    { id: "9a", nodeId: 9, value: 120 },

    { id: "10a", nodeId: 10, value: 80 },

    { id: "11a", nodeId: 11, value: 150 },
    { id: "11b", nodeId: 11, value: 100 },
    { id: "11d", nodeId: 11, value: 60 },
    { id: "11c", nodeId: 11, value: 300 },

    { id: "12a", nodeId: 12, value: 250 },
    { id: "12b", nodeId: 12, value: 200 },
    { id: "12c", nodeId: 12, value: 400 },
  ],
  });

await prisma.connection.createMany({
  data: [
    { sourcePortId: "1a", targetPortId: "2a" },

    { sourcePortId: "2b", targetPortId: "6b" },
    { sourcePortId: "3a", targetPortId: "6a" },
    { sourcePortId: "6c", targetPortId: "12a" },

    { sourcePortId: "4a", targetPortId: "7a" },
    { sourcePortId: "5a", targetPortId: "7b" },
    { sourcePortId: "7c", targetPortId: "12b" },

    { sourcePortId: "8a", targetPortId: "11a" },
    { sourcePortId: "9a", targetPortId: "11b" },
    { sourcePortId: "10a", targetPortId: "11d" },
    { sourcePortId: "11c", targetPortId: "12c" },
  ],
  });

  console.log("Seed done");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });