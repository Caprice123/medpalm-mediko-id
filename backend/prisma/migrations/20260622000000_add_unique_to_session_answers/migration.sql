ALTER TABLE "challenge_session_answers" ADD CONSTRAINT "challenge_session_answers_session_id_question_id_key" UNIQUE ("session_id", "question_id");
