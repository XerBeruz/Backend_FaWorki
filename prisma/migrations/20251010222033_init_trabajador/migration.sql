/*
  Warnings:

  - You are about to drop the column `descripcion` on the `trabajadores` table. All the data in the column will be lost.
  - You are about to drop the column `disponibilidad` on the `trabajadores` table. All the data in the column will be lost.
  - You are about to drop the column `experiencia` on the `trabajadores` table. All the data in the column will be lost.
  - You are about to drop the column `fechaNacimiento` on the `trabajadores` table. All the data in the column will be lost.
  - You are about to drop the column `genero` on the `trabajadores` table. All the data in the column will be lost.
  - You are about to drop the column `profesion` on the `trabajadores` table. All the data in the column will be lost.
  - You are about to drop the column `salarioEsperado` on the `trabajadores` table. All the data in the column will be lost.
  - You are about to drop the column `apellido` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `direccion` on the `usuarios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[numeroDocumento]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apellido1` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroDocumento` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoDocumento` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Made the column `telefono` on table `usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "trabajadores" DROP COLUMN "descripcion",
DROP COLUMN "disponibilidad",
DROP COLUMN "experiencia",
DROP COLUMN "fechaNacimiento",
DROP COLUMN "genero",
DROP COLUMN "profesion",
DROP COLUMN "salarioEsperado";

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "apellido",
DROP COLUMN "direccion",
ADD COLUMN     "apellido1" TEXT NOT NULL,
ADD COLUMN     "apellido2" TEXT,
ADD COLUMN     "numeroDocumento" TEXT NOT NULL,
ADD COLUMN     "tipoDocumento" TEXT NOT NULL,
ALTER COLUMN "telefono" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_numeroDocumento_key" ON "usuarios"("numeroDocumento");
