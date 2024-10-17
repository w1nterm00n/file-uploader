/*
  Warnings:

  - Added the required column `original_name` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "original_name" VARCHAR(255) NOT NULL,
ADD COLUMN     "type" VARCHAR(255) NOT NULL;
