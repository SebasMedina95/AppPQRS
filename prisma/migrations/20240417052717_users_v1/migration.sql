-- CreateTable
CREATE TABLE "USER_USERS" (
    "id" SERIAL NOT NULL,
    "typeDocument" VARCHAR(5) NOT NULL,
    "document" VARCHAR(30) NOT NULL,
    "fullName" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "emailValidated" BOOLEAN NOT NULL DEFAULT false,
    "password" VARCHAR(70) NOT NULL,
    "role" TEXT[] DEFAULT ARRAY['USER']::TEXT[],
    "status" BOOLEAN NOT NULL DEFAULT true,
    "img" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "cellPhone" TEXT,
    "description" TEXT,

    CONSTRAINT "USER_USERS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USER_USERS_document_key" ON "USER_USERS"("document");

-- CreateIndex
CREATE UNIQUE INDEX "USER_USERS_email_key" ON "USER_USERS"("email");
