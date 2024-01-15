/*
  Warnings:

  - You are about to drop the `Link` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Link";

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
