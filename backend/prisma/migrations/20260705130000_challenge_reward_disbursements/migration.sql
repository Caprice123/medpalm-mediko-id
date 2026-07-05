CREATE TABLE "challenge_reward_disbursements" (
  "id" SERIAL NOT NULL,
  "challenge_reward_id" INTEGER NOT NULL,
  "challenge_session_id" INTEGER NOT NULL,
  "status" VARCHAR NOT NULL DEFAULT 'pending',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "challenge_reward_disbursements_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "challenge_reward_disbursements"
  ADD CONSTRAINT "challenge_reward_disbursements_challenge_reward_id_fkey"
  FOREIGN KEY ("challenge_reward_id") REFERENCES "challenge_rewards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "challenge_reward_disbursements"
  ADD CONSTRAINT "challenge_reward_disbursements_challenge_session_id_fkey"
  FOREIGN KEY ("challenge_session_id") REFERENCES "challenge_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "challenge_reward_disbursements"
  ADD CONSTRAINT "challenge_reward_disbursements_reward_session_key"
  UNIQUE ("challenge_reward_id", "challenge_session_id");
