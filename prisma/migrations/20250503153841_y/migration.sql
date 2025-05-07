/*
  Warnings:

  - Changed the type of `bookedslots` on the `BookingPage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "BookingPage" DROP COLUMN "bookedslots",
ADD COLUMN     "bookedslots" JSONB NOT NULL;
