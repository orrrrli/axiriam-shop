-- AlterTable
ALTER TABLE "InventoryItem" ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT '{}';
