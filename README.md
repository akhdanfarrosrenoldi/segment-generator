# Segment Generator

Backend take-home test implementation for generating segments from a directed graph/canvas.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Prisma PostgreSQL Adapter

## Requirements

- Node.js
- npm
- PostgreSQL

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env`.

Example:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/segment_generator"
PORT=3000
```

Create a PostgreSQL database named:

```text
segment_generator
```

Adjust the database username, password, host, and port if necessary.

### 3. Run database migration

```bash
npm run db:migrate
```

### 4. Seed the canvas data

```bash
npm run db:seed
```

### 5. Start the application

```bash
npm start
```

For development with automatic restart:

```bash
npm run dev
```

The API runs by default at:

```text
http://localhost:3000
```

## API Endpoints

### GET /

Health/basic API response.

Example:

```json
{
  "message": "Segment Generator API"
}
```

### GET /api/canvas

Returns the complete canvas data stored in PostgreSQL, including nodes, ports, and directed connections.

Example response structure:

```json
{
  "nodes": [
    {
      "id": 1,
      "ports": [
        {
          "id": "1a",
          "nodeId": 1,
          "value": 100
        }
      ]
    }
  ],
  "connections": [
    {
      "id": 1,
      "sourcePortId": "1a",
      "targetPortId": "2a"
    }
  ]
}
```

### GET /api/segments

Calculates and returns all segments dynamically from the canvas data stored in the database.

Example response structure:

```json
{
  "count": 9,
  "segments": [
    {
      "target": "2a",
      "sources": ["1a"],
      "targetValue": 90,
      "sourceTotal": 100,
      "result": -10
    }
  ]
}
```

For the seeded canvas, the API generates 9 segments.

## Segment Calculation

A segment is calculated using:

```text
target value - sum of nearest valued source(s)
```

When tracing backward from a target:

1. If the encountered port has a value, that port becomes a source and traversal stops on that path.
2. If the encountered port has a `NULL` value, traversal continues backward.
3. When multiple incoming paths exist, the nearest valued source from each path is collected.
4. `NULL` is treated differently from `0`. A value of `0` is a valid value and stops traversal.

Example:

```text
12b = 200
4a  = 70
5a  = 160

200 - (70 + 160) = -30
```

## Database Constraints

The database enforces the connection requirements using unique constraints:

- `sourcePortId` is unique.
- `targetPortId` is unique.

Therefore, a port cannot be the source of more than one stored connection and cannot be the target of more than one stored connection.

Foreign keys ensure that every connection references existing ports.

## Seed Data

The seed contains:

- 12 nodes
- 22 ports
- 11 directed connections

The seed can safely be executed multiple times because existing connections, ports, and nodes are cleared in foreign-key-safe order before inserting the required canvas data.

## Tests

Run:

```bash
npm test
```

The tests verify:

- All expected segments are generated.
- The seeded canvas produces 9 segments.
- Recursive traversal through `NULL` ports finds the nearest valued sources.
- A value of `0` is treated as a valid value rather than `NULL`.

## Project Structure

```text
segment-generator/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── lib/
│   │   └── prisma.js
│   ├── app.js
│   └── segment.js
├── test/
│   └── segment.test.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── prisma7.config.ts
└── README.md
```

## Available Commands

```bash
npm start
npm run dev
npm test
npm run db:migrate
npm run db:seed
npm run db:studio
npm run db:generate
```