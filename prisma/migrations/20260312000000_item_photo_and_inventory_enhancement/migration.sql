-- Step 1: Add new columns with defaults
ALTER TABLE "InventoryItem" ADD COLUMN "photoUrl" TEXT;
ALTER TABLE "InventoryItem" ADD COLUMN "quantityCompleto" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "InventoryItem" ADD COLUMN "quantitySencillo" INTEGER NOT NULL DEFAULT 0;

-- Step 2: Migrate quantity data - split evenly, remainder goes to completo
UPDATE "InventoryItem"
SET
  "quantityCompleto" = CEIL("quantity"::numeric / 2),
  "quantitySencillo" = FLOOR("quantity"::numeric / 2);

-- Step 3: Drop old quantity column
ALTER TABLE "InventoryItem" DROP COLUMN "quantity";

-- Step 4: Map existing category values to new enum values
-- sencillo -> bandana, doble_vista -> gorrito, completo -> gorrito
UPDATE "InventoryItem" SET "category" = 'sencillo' WHERE "category" = 'sencillo';
-- We need to map through text first, so rename old enum and create new one

ALTER TYPE "InventoryItemCategory" RENAME TO "InventoryItemCategory_old";
CREATE TYPE "InventoryItemCategory" AS ENUM ('bandana', 'gorrito');
ALTER TABLE "InventoryItem"
  ALTER COLUMN "category" TYPE "InventoryItemCategory"
  USING (
    CASE "category"::text
      WHEN 'sencillo' THEN 'bandana'
      WHEN 'doble_vista' THEN 'gorrito'
      WHEN 'completo' THEN 'gorrito'
    END
  )::"InventoryItemCategory";
DROP TYPE "InventoryItemCategory_old";

-- Step 5: Map existing material type values to new enum values
-- All old types map to stretch_antifluido as default, stretch_antifluido stays
ALTER TYPE "MaterialType" RENAME TO "MaterialType_old";
CREATE TYPE "MaterialType" AS ENUM ('stretch_antifluido', 'brush');

-- Update InventoryItem type column
ALTER TABLE "InventoryItem"
  ALTER COLUMN "type" TYPE "MaterialType"
  USING (
    CASE "type"::text
      WHEN 'stretch_antifluido' THEN 'stretch_antifluido'
      ELSE 'stretch_antifluido'
    END
  )::"MaterialType";

-- Update RawMaterial type column
ALTER TABLE "RawMaterial"
  ALTER COLUMN "type" TYPE "MaterialType"
  USING (
    CASE "type"::text
      WHEN 'stretch_antifluido' THEN 'stretch_antifluido'
      ELSE 'stretch_antifluido'
    END
  )::"MaterialType";

-- Update OrderMaterialDesign type column (nullable)
ALTER TABLE "OrderMaterialDesign"
  ALTER COLUMN "type" TYPE "MaterialType"
  USING (
    CASE
      WHEN "type" IS NULL THEN NULL
      WHEN "type"::text = 'stretch_antifluido' THEN 'stretch_antifluido'
      ELSE 'stretch_antifluido'
    END
  )::"MaterialType";

DROP TYPE "MaterialType_old";
