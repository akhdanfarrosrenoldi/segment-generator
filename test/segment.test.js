const test = require("node:test");
const assert = require("node:assert/strict");

const { generateSegments } = require("../src/segment");

const nodes = [
  { id: 1, ports: [{ id: "1a", nodeId: 1, value: 100 }] },

  {
    id: 2,
    ports: [
      { id: "2a", nodeId: 2, value: 90 },
      { id: "2b", nodeId: 2, value: 130 },
    ],
  },

  { id: 3, ports: [{ id: "3a", nodeId: 3, value: 150 }] },
  { id: 4, ports: [{ id: "4a", nodeId: 4, value: 70 }] },
  { id: 5, ports: [{ id: "5a", nodeId: 5, value: 160 }] },

  {
    id: 6,
    ports: [
      { id: "6a", nodeId: 6, value: null },
      { id: "6b", nodeId: 6, value: null },
      { id: "6c", nodeId: 6, value: null },
    ],
  },

  {
    id: 7,
    ports: [
      { id: "7a", nodeId: 7, value: null },
      { id: "7b", nodeId: 7, value: null },
      { id: "7c", nodeId: 7, value: null },
    ],
  },

  { id: 8, ports: [{ id: "8a", nodeId: 8, value: 200 }] },
  { id: 9, ports: [{ id: "9a", nodeId: 9, value: 120 }] },
  { id: 10, ports: [{ id: "10a", nodeId: 10, value: 80 }] },

  {
    id: 11,
    ports: [
      { id: "11a", nodeId: 11, value: 150 },
      { id: "11b", nodeId: 11, value: 100 },
      { id: "11d", nodeId: 11, value: 60 },
      { id: "11c", nodeId: 11, value: 300 },
    ],
  },

  {
    id: 12,
    ports: [
      { id: "12a", nodeId: 12, value: 250 },
      { id: "12b", nodeId: 12, value: 200 },
      { id: "12c", nodeId: 12, value: 400 },
    ],
  },
];

const connections = [
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
];

test("generates all expected segments", () => {
  const segments = generateSegments(nodes, connections);

  assert.equal(segments.length, 9);

  assert.deepEqual(
    segments.map(({ target, sources, result }) => ({
      target,
      sources,
      result,
    })),
    [
      { target: "2a", sources: ["1a"], result: -10 },
      { target: "2b", sources: ["2a"], result: 40 },

      { target: "11a", sources: ["8a"], result: -50 },
      { target: "11b", sources: ["9a"], result: -20 },
      { target: "11d", sources: ["10a"], result: -20 },
      {
        target: "11c",
        sources: ["11a", "11b", "11d"],
        result: -10,
      },

      { target: "12a", sources: ["3a", "2b"], result: -30 },
      { target: "12b", sources: ["4a", "5a"], result: -30 },
      { target: "12c", sources: ["11c"], result: 100 },
    ]
  );
});

test("treats zero as a valid port value", () => {
  const testNodes = [
    {
      id: 1,
      ports: [{ id: "1a", nodeId: 1, value: 0 }],
    },
    {
      id: 2,
      ports: [{ id: "2a", nodeId: 2, value: 10 }],
    },
  ];

  const testConnections = [
    {
      sourcePortId: "1a",
      targetPortId: "2a",
    },
  ];

  const segments = generateSegments(
    testNodes,
    testConnections
  );

  assert.equal(segments.length, 1);
  assert.equal(segments[0].result, 10);
  assert.deepEqual(segments[0].sources, ["1a"]);
});