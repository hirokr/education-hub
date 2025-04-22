-- CreateTable
CREATE TABLE "Scholarship" (
    "id" TEXT NOT NULL,
    "scholarship_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sponsor" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "amount" TEXT NOT NULL,
    "eligibility" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "tags" TEXT[],
    "posted_on" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scholarship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_logo" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "salary_range" JSONB NOT NULL,
    "job_tags" TEXT[],
    "job_description" TEXT NOT NULL,
    "posted_on" TIMESTAMP(3) NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scholarship_scholarship_id_key" ON "Scholarship"("scholarship_id");

-- CreateIndex
CREATE UNIQUE INDEX "Job_job_id_key" ON "Job"("job_id");
