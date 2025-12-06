-- CreateTable: gene_activation_history
CREATE TABLE IF NOT EXISTS "gene_activation_history" (
    "id" TEXT NOT NULL,
    "gene_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "performed_by" TEXT,
    "reason" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gene_activation_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "gene_activation_history_gene_id_idx" ON "gene_activation_history"("gene_id");
CREATE INDEX "gene_activation_history_created_at_idx" ON "gene_activation_history"("created_at");

-- CreateTable: gene_dependencies
CREATE TABLE IF NOT EXISTS "gene_dependencies" (
    "id" TEXT NOT NULL,
    "gene_id" TEXT NOT NULL,
    "depends_on_gene_id" TEXT NOT NULL,
    "dependency_type" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gene_dependencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gene_dependencies_gene_id_depends_on_gene_id_key" ON "gene_dependencies"("gene_id", "depends_on_gene_id");
CREATE INDEX "gene_dependencies_gene_id_idx" ON "gene_dependencies"("gene_id");
CREATE INDEX "gene_dependencies_depends_on_gene_id_idx" ON "gene_dependencies"("depends_on_gene_id");
