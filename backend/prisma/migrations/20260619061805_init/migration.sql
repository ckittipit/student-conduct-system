-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TEACHER', 'VIEWER');

-- CreateEnum
CREATE TYPE "GradeLevel" AS ENUM ('M1', 'M2', 'M3', 'M4', 'M5', 'M6');

-- CreateEnum
CREATE TYPE "RemarkCategory" AS ENUM ('CONFESSION', 'PROBATION', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "googleId" TEXT,
    "role" "Role" NOT NULL DEFAULT 'TEACHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "studentCode" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "imageUrl" TEXT,
    "currentGrade" "GradeLevel" NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 100,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conduct_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conduct_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conduct_items" (
    "id" TEXT NOT NULL,
    "conductTypeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pointDeduction" INTEGER NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conduct_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conduct_records" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "conductItemId" TEXT NOT NULL,
    "recordedById" TEXT NOT NULL,
    "pointsDeducted" INTEGER NOT NULL,
    "remarkCategory" "RemarkCategory",
    "note" TEXT,
    "evidenceUrl" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conduct_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bonus_records" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "recordedById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pointsAdded" INTEGER NOT NULL,
    "note" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bonus_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "students_studentCode_key" ON "students"("studentCode");

-- CreateIndex
CREATE INDEX "students_studentCode_idx" ON "students"("studentCode");

-- CreateIndex
CREATE INDEX "students_firstName_lastName_idx" ON "students"("firstName", "lastName");

-- CreateIndex
CREATE UNIQUE INDEX "conduct_types_name_key" ON "conduct_types"("name");

-- CreateIndex
CREATE INDEX "conduct_items_conductTypeId_idx" ON "conduct_items"("conductTypeId");

-- CreateIndex
CREATE INDEX "conduct_records_studentId_idx" ON "conduct_records"("studentId");

-- CreateIndex
CREATE INDEX "conduct_records_recordedAt_idx" ON "conduct_records"("recordedAt");

-- CreateIndex
CREATE INDEX "bonus_records_studentId_idx" ON "bonus_records"("studentId");

-- CreateIndex
CREATE INDEX "bonus_records_recordedAt_idx" ON "bonus_records"("recordedAt");

-- AddForeignKey
ALTER TABLE "conduct_items" ADD CONSTRAINT "conduct_items_conductTypeId_fkey" FOREIGN KEY ("conductTypeId") REFERENCES "conduct_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conduct_records" ADD CONSTRAINT "conduct_records_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conduct_records" ADD CONSTRAINT "conduct_records_conductItemId_fkey" FOREIGN KEY ("conductItemId") REFERENCES "conduct_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conduct_records" ADD CONSTRAINT "conduct_records_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bonus_records" ADD CONSTRAINT "bonus_records_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bonus_records" ADD CONSTRAINT "bonus_records_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
