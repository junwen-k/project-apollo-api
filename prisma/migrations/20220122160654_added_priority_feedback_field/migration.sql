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
    "priority" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL DEFAULT 'low-quality',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Feedback" ("category", "contactNo", "createdAt", "email", "id", "name", "product", "rating", "verbatim") SELECT "category", "contactNo", "createdAt", "email", "id", "name", "product", "rating", "verbatim" FROM "Feedback";
DROP TABLE "Feedback";
ALTER TABLE "new_Feedback" RENAME TO "Feedback";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
