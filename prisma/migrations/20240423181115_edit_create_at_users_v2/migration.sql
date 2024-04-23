/*
  Warnings:

  - The `createDateAt` column on the `USER_USERS` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "USER_USERS" DROP COLUMN "createDateAt",
ADD COLUMN     "createDateAt" TIMESTAMP(3);
