/*
  Warnings:

  - You are about to drop the column `role` on the `USER_USERS` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "USER_USERS" DROP COLUMN "role",
ADD COLUMN     "roles" TEXT[] DEFAULT ARRAY['USER']::TEXT[];
