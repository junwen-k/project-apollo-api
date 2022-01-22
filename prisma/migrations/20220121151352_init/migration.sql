-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "preferredBank" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "touchpoint" TEXT NOT NULL,
    "verbatim" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
