-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Director', 'Coordinator');

-- CreateEnum
CREATE TYPE "ProgramType" AS ENUM ('Undergraduate', 'Graduate');

-- CreateEnum
CREATE TYPE "AttributeType" AS ENUM ('Numeric', 'Boolean', 'Enum');

-- CreateEnum
CREATE TYPE "Operator" AS ENUM ('GREATER_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN', 'LESS_THAN_OR_EQUAL', 'EQUAL');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Program" (
    "program_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ProgramType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("program_id")
);

-- CreateTable
CREATE TABLE "Program_Assignment" (
    "assignment_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "program_id" INTEGER NOT NULL,

    CONSTRAINT "Program_Assignment_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateTable
CREATE TABLE "Admission_Rule" (
    "rule_id" SERIAL NOT NULL,
    "program_id" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "attribute_name" TEXT NOT NULL,
    "attribute_type" "AttributeType" NOT NULL,
    "required" BOOLEAN NOT NULL,
    "display_order" INTEGER NOT NULL,

    CONSTRAINT "Admission_Rule_pkey" PRIMARY KEY ("rule_id")
);

-- CreateTable
CREATE TABLE "Rule_Condition" (
    "condition_id" SERIAL NOT NULL,
    "rule_id" INTEGER NOT NULL,
    "operator" "Operator" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "weight" INTEGER NOT NULL,

    CONSTRAINT "Rule_Condition_pkey" PRIMARY KEY ("condition_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Program_Assignment" ADD CONSTRAINT "Program_Assignment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program_Assignment" ADD CONSTRAINT "Program_Assignment_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "Program"("program_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admission_Rule" ADD CONSTRAINT "Admission_Rule_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "Program"("program_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule_Condition" ADD CONSTRAINT "Rule_Condition_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "Admission_Rule"("rule_id") ON DELETE RESTRICT ON UPDATE CASCADE;
