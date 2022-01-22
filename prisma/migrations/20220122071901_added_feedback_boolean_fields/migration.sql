-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preferredBank" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "touchpoint" TEXT,
    "verbatim" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActionable" BOOLEAN NOT NULL DEFAULT false,
    "isSpam" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Feedback" ("createdAt", "date", "id", "preferredBank", "product", "rating", "touchpoint", "verbatim") SELECT "createdAt", "date", "id", "preferredBank", "product", "rating", "touchpoint", "verbatim" FROM "Feedback";
DROP TABLE "Feedback";
ALTER TABLE "new_Feedback" RENAME TO "Feedback";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
