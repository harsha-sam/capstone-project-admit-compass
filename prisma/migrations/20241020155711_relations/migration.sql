/*
  Warnings:

  - The primary key for the `Admission_Rule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `attribute_name` on the `Admission_Rule` table. All the data in the column will be lost.
  - You are about to drop the column `attribute_type` on the `Admission_Rule` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Admission_Rule` table. All the data in the column will be lost.
  - You are about to drop the column `display_order` on the `Admission_Rule` table. All the data in the column will be lost.
  - You are about to drop the column `program_id` on the `Admission_Rule` table. All the data in the column will be lost.
  - You are about to drop the column `required` on the `Admission_Rule` table. All the data in the column will be lost.
  - You are about to drop the column `rule_id` on the `Admission_Rule` table. All the data in the column will be lost.
  - You are about to drop the column `rule_id` on the `Rule_Condition` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Program` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,program_id]` on the table `Program_Assignment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Admission_Rule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Admission_Rule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attribute_id` to the `Rule_Condition` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Admission_Rule" DROP CONSTRAINT "Admission_Rule_program_id_fkey";

-- DropForeignKey
ALTER TABLE "Rule_Condition" DROP CONSTRAINT "Rule_Condition_rule_id_fkey";

-- AlterTable
ALTER TABLE "Admission_Rule" DROP CONSTRAINT "Admission_Rule_pkey",
DROP COLUMN "attribute_name",
DROP COLUMN "attribute_type",
DROP COLUMN "category",
DROP COLUMN "display_order",
DROP COLUMN "program_id",
DROP COLUMN "required",
DROP COLUMN "rule_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "rule_set_id" SERIAL NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Admission_Rule_pkey" PRIMARY KEY ("rule_set_id");

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "rule_set_id" INTEGER;

-- AlterTable
ALTER TABLE "Rule_Condition" DROP COLUMN "rule_id",
ADD COLUMN     "attribute_id" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "AttributeType";

-- DropEnum
DROP TYPE "ProgramType";

-- CreateTable
CREATE TABLE "Rule_Attribute" (
    "attribute_id" SERIAL NOT NULL,
    "rule_set_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL,
    "display_order" INTEGER NOT NULL,

    CONSTRAINT "Rule_Attribute_pkey" PRIMARY KEY ("attribute_id")
);

-- CreateTable
CREATE TABLE "Weight_Range" (
    "range_id" SERIAL NOT NULL,
    "rule_set_id" INTEGER NOT NULL,
    "min_weight" INTEGER NOT NULL,
    "max_weight" INTEGER NOT NULL,
    "admission_chance" INTEGER NOT NULL,

    CONSTRAINT "Weight_Range_pkey" PRIMARY KEY ("range_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Program_name_key" ON "Program"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Program_Assignment_user_id_program_id_key" ON "Program_Assignment"("user_id", "program_id");

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_rule_set_id_fkey" FOREIGN KEY ("rule_set_id") REFERENCES "Admission_Rule"("rule_set_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule_Attribute" ADD CONSTRAINT "Rule_Attribute_rule_set_id_fkey" FOREIGN KEY ("rule_set_id") REFERENCES "Admission_Rule"("rule_set_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule_Condition" ADD CONSTRAINT "Rule_Condition_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "Rule_Attribute"("attribute_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weight_Range" ADD CONSTRAINT "Weight_Range_rule_set_id_fkey" FOREIGN KEY ("rule_set_id") REFERENCES "Admission_Rule"("rule_set_id") ON DELETE RESTRICT ON UPDATE CASCADE;
