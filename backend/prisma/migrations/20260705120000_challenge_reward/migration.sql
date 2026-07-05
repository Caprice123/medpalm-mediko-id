CREATE TABLE "challenge_rewards" (
  "id" SERIAL NOT NULL,
  "challenge_id" INTEGER NOT NULL,
  "title" VARCHAR NOT NULL,
  "description" TEXT,
  "status" VARCHAR NOT NULL DEFAULT 'pending',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "challenge_rewards_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "challenge_rewards" ADD CONSTRAINT "challenge_rewards_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "challenge_sessions" ADD COLUMN "reward_read" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "challenge_rewards" ADD COLUMN "min_rank" INTEGER;
ALTER TABLE "challenge_rewards" ADD COLUMN "max_rank" INTEGER;
