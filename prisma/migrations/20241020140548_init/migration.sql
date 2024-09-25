/*
  Warnings:

  - Added the required column `url` to the `Program` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Program` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "url" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;
