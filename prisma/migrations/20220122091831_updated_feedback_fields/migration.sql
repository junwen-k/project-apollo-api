/*
  Warnings:

  - You are about to drop the column `date` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `isActionable` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `isSpam` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `preferredBank` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `touchpoint` on the `Feedback` table. All the data in the column will be lost.
  - Added the required column `contactNo` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactNo" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "rating" INTEGER,
    "verbatim" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'low-quality',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Feedback" ("createdAt", "id", "product", "rating", "verbatim") SELECT "createdAt", "id", "product", "rating", "verbatim" FROM "Feedback";
DROP TABLE "Feedback";
ALTER TABLE "new_Feedback" RENAME TO "Feedback";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
