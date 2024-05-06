-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('Solicitud', 'Reconocimiento', 'Queja', 'Sugerencia');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Activa', 'Anulada', 'Procesando', 'Escalado', 'Finalizada');

-- CreateTable
CREATE TABLE "PQRS_PQRS" (
    "id" SERIAL NOT NULL,
    "radicated" VARCHAR(50) NOT NULL,
    "requestTypeId" "RequestType" NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "status" "Status" NOT NULL,
    "scalingOther" BOOLEAN NOT NULL DEFAULT false,
    "scalingRadicated" VARCHAR(50),
    "createDateAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PQRS_PQRS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SEGU_PQRS" (
    "id" SERIAL NOT NULL,
    "status" "Status" NOT NULL,
    "response" VARCHAR(500) NOT NULL,
    "createDateAt" TIMESTAMP(3),
    "employeeId" INTEGER NOT NULL,
    "pqrsId" INTEGER NOT NULL,

    CONSTRAINT "SEGU_PQRS_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PQRS_PQRS" ADD CONSTRAINT "PQRS_PQRS_userId_fkey" FOREIGN KEY ("userId") REFERENCES "USER_USERS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SEGU_PQRS" ADD CONSTRAINT "SEGU_PQRS_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "USER_USERS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SEGU_PQRS" ADD CONSTRAINT "SEGU_PQRS_pqrsId_fkey" FOREIGN KEY ("pqrsId") REFERENCES "PQRS_PQRS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
