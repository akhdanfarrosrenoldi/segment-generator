const express = require("express");
const prisma = require("./lib/prisma");
const app = express();
const PORT = process.env.PORT || 3000;
const { generateSegments } = require("./segment");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Segment Generator API",
  });
});

app.get("/api/canvas", async (req, res) => {
  try {
    const nodes = await prisma.node.findMany({
      include: {
        ports: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    const connections = await prisma.connection.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.json({
      nodes,
      connections,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get canvas",
    });
  }
});

app.get("/api/segments", async (req, res) => {
  try {
    const nodes = await prisma.node.findMany({
      include: {
        ports: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    const connections = await prisma.connection.findMany({
      orderBy: {
        id: "asc",
      },
    });

    const segments = generateSegments(nodes, connections);

    res.json({
      count: segments.length,
      segments,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate segments",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});