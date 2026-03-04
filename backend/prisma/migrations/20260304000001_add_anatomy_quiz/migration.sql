-- Create anatomy_quizzes table
CREATE TABLE anatomy_quizzes (
  id             SERIAL PRIMARY KEY,
  unique_id      TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  title          TEXT NOT NULL,
  description    TEXT,
  status         TEXT NOT NULL DEFAULT 'draft',
  question_count INT NOT NULL DEFAULT 0,
  embed_url      TEXT,
  media_type     TEXT NOT NULL DEFAULT '2d',
  created_by     INT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create anatomy_questions table
CREATE TABLE anatomy_questions (
  id          SERIAL PRIMARY KEY,
  quiz_id     INT NOT NULL REFERENCES anatomy_quizzes(id) ON DELETE CASCADE,
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  answer_type TEXT NOT NULL DEFAULT 'text',
  choices     JSONB,
  "order"     INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create anatomy_quiz_tags table
CREATE TABLE anatomy_quiz_tags (
  id         SERIAL PRIMARY KEY,
  quiz_id    INT NOT NULL REFERENCES anatomy_quizzes(id) ON DELETE CASCADE,
  tag_id     INT NOT NULL REFERENCES tags(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(quiz_id, tag_id)
);

-- Create anatomy_quiz_attempts table
CREATE TABLE anatomy_quiz_attempts (
  id              SERIAL PRIMARY KEY,
  user_id         INT NOT NULL,
  quiz_id         INT NOT NULL REFERENCES anatomy_quizzes(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'in_progress',
  correct_count   INT NOT NULL DEFAULT 0,
  total_questions INT NOT NULL,
  score           INT NOT NULL DEFAULT 0,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create anatomy_quiz_answers table
CREATE TABLE anatomy_quiz_answers (
  id               SERIAL PRIMARY KEY,
  attempt_id       INT NOT NULL REFERENCES anatomy_quiz_attempts(id) ON DELETE CASCADE,
  question_id      INT NOT NULL REFERENCES anatomy_questions(id),
  user_answer      TEXT NOT NULL,
  is_correct       BOOLEAN NOT NULL,
  similarity_score FLOAT,
  answered_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_anatomy_progress table
CREATE TABLE user_anatomy_progress (
  id              SERIAL PRIMARY KEY,
  user_id         INT NOT NULL,
  question_id     INT NOT NULL,
  quiz_id         INT NOT NULL,
  times_correct   INT NOT NULL DEFAULT 0,
  times_incorrect INT NOT NULL DEFAULT 0,
  last_reviewed   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Indexes
CREATE INDEX idx_anatomy_quizzes_created_by ON anatomy_quizzes(created_by);
CREATE INDEX idx_anatomy_quizzes_status ON anatomy_quizzes(status);
CREATE INDEX idx_anatomy_quizzes_media_type ON anatomy_quizzes(media_type);
CREATE INDEX idx_anatomy_questions_quiz_id ON anatomy_questions(quiz_id);
CREATE INDEX idx_anatomy_questions_order ON anatomy_questions("order");
CREATE INDEX idx_anatomy_quiz_tags_quiz_id ON anatomy_quiz_tags(quiz_id);
CREATE INDEX idx_anatomy_quiz_tags_tag_id ON anatomy_quiz_tags(tag_id);
CREATE INDEX idx_anatomy_quiz_attempts_user_id ON anatomy_quiz_attempts(user_id);
CREATE INDEX idx_anatomy_quiz_attempts_quiz_id ON anatomy_quiz_attempts(quiz_id);
CREATE INDEX idx_anatomy_quiz_attempts_status ON anatomy_quiz_attempts(status);
CREATE INDEX idx_anatomy_quiz_answers_attempt_id ON anatomy_quiz_answers(attempt_id);
CREATE INDEX idx_anatomy_quiz_answers_question_id ON anatomy_quiz_answers(question_id);
CREATE INDEX idx_user_anatomy_progress_user_id ON user_anatomy_progress(user_id);
CREATE INDEX idx_user_anatomy_progress_question_id ON user_anatomy_progress(question_id);
CREATE INDEX idx_user_anatomy_progress_quiz_id ON user_anatomy_progress(quiz_id);
CREATE INDEX anatomy_quizzes_search_gin_idx ON anatomy_quizzes USING GIN (title gin_trgm_ops, description gin_trgm_ops);

-- Seed anatomy constants
INSERT INTO constants (key, value) VALUES
  ('anatomy_feature_title', 'Quiz Anatomi Interaktif'),
  ('anatomy_feature_description', 'Quiz anatomi berbasis gambar untuk membantu mahasiswa kedokteran memahami dan menghafal struktur anatomi tubuh manusia'),
  ('anatomy_access_type', 'subscription'),
  ('anatomy_credit_cost', '0'),
  ('anatomy_is_active', 'true'),
  ('anatomy_generation_model', ''),
  ('anatomy_generation_prompt', '')
ON CONFLICT (key) DO NOTHING;
