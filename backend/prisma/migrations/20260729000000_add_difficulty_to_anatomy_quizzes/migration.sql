ALTER TABLE "anatomy_quizzes" ADD COLUMN "difficulty" TEXT NOT NULL DEFAULT 'medium';
ALTER TABLE "anatomy_quizzes" ADD COLUMN "estimated_minutes" INTEGER;
