-- CreateTable
CREATE TABLE "Node" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Port" (
    "id" VARCHAR(10) NOT NULL,
    "nodeId" INTEGER NOT NULL,
    "value" INTEGER,

    CONSTRAINT "Port_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" SERIAL NOT NULL,
    "sourcePortId" VARCHAR(10) NOT NULL,
    "targetPortId" VARCHAR(10) NOT NULL,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Connection_sourcePortId_key" ON "Connection"("sourcePortId");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_targetPortId_key" ON "Connection"("targetPortId");

-- AddForeignKey
ALTER TABLE "Port" ADD CONSTRAINT "Port_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_sourcePortId_fkey" FOREIGN KEY ("sourcePortId") REFERENCES "Port"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_targetPortId_fkey" FOREIGN KEY ("targetPortId") REFERENCES "Port"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
