-- CreateTable: OSCE Rubrics
CREATE TABLE "osce_rubrics" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osce_rubrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable: OSCE Observation Groups
CREATE TABLE "osce_observation_groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osce_observation_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable: OSCE Observations
CREATE TABLE "osce_observations" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osce_observations_pkey" PRIMARY KEY ("id")
);

-- CreateTable: OSCE Topics
CREATE TABLE "osce_topics" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scenario" TEXT NOT NULL,
    "guide" TEXT,
    "context" TEXT,
    "answer_key" TEXT,
    "knowledge_base" JSONB,
    "ai_model" TEXT NOT NULL,
    "osce_rubric_id" INTEGER NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osce_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable: OSCE Topic Tags
CREATE TABLE "osce_topic_tags" (
    "id" SERIAL NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osce_topic_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable: OSCE Topic Observations (Junction Table)
CREATE TABLE "osce_topic_observations" (
    "id" SERIAL NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "observation_id" INTEGER NOT NULL,
    "observation_text" TEXT,
    "requires_interpretation" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osce_topic_observations_pkey" PRIMARY KEY ("id")
);

-- CreateTable: OSCE Sessions
CREATE TABLE "osce_sessions" (
    "id" SERIAL NOT NULL,
    "unique_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "osce_topic_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'created',
    "time_taken" INTEGER NOT NULL DEFAULT 0,
    "total_score" INTEGER,
    "max_score" INTEGER,
    "ai_feedback" TEXT,
    "credits_used" INTEGER NOT NULL DEFAULT 0,
    "observations_locked" BOOLEAN NOT NULL DEFAULT false,
    "scheduled_end_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osce_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable: OSCE Session Topic Snapshots
CREATE TABLE "osce_session_topic_snapshots" (
    "id" SERIAL NOT NULL,
    "osce_session_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scenario" TEXT NOT NULL,
    "guide" TEXT,
    "context" TEXT,
    "answer_key" TEXT,
    "knowledge_base" JSONB,
    "ai_model" TEXT NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osce_session_topic_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable: OSCE Session Tag Snapshots
CREATE TABLE "osce_session_tag_snapshots" (
    "id" SERIAL NOT NULL,
    "osce_session_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "osce_session_tag_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable: OSCE Session Observation Group Snapshots
CREATE TABLE "osce_session_observation_group_snapshots" (
    "id" SERIAL NOT NULL,
    "osce_session_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "group_name" TEXT NOT NULL,
    "group_created_at" TIMESTAMP(3),
    "group_updated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osce_session_observation_group_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable: OSCE Session Observation Snapshots
CREATE TABLE "osce_session_observation_snapshots" (
    "id" SERIAL NOT NULL,
    "group_snapshot_id" INTEGER NOT NULL,
    "observation_id" INTEGER DEFAULT 0,
    "observation_group_id" INTEGER,
    "observation_name" TEXT DEFAULT '',
    "observation_created_at" TIMESTAMP(3),
    "observation_updated_at" TIMESTAMP(3),
    "observation_text" TEXT,
    "requires_interpretation" BOOLEAN NOT NULL DEFAULT false,
    "topic_observation_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osce_session_observation_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable: OSCE Session Rubric Snapshots
CREATE TABLE "osce_session_rubric_snapshots" (
    "id" SERIAL NOT NULL,
    "osce_session_id" INTEGER NOT NULL,
    "rubric_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osce_session_rubric_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable: OSCE Session Observations (User Interactions)
CREATE TABLE "osce_session_observations" (
    "id" SERIAL NOT NULL,
    "osce_session_id" INTEGER NOT NULL,
    "observation_snapshot_id" INTEGER NOT NULL,
    "interpretation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osce_session_observations_pkey" PRIMARY KEY ("id")
);

-- CreateTable: OSCE Session Messages
CREATE TABLE "osce_session_messages" (
    "id" SERIAL NOT NULL,
    "osce_session_id" INTEGER NOT NULL,
    "sender_type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "credits_used" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osce_session_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable: OSCE Session Diagnoses
CREATE TABLE "osce_session_diagnoses" (
    "id" SERIAL NOT NULL,
    "osce_session_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osce_session_diagnoses_pkey" PRIMARY KEY ("id")
);

-- CreateTable: OSCE Session Therapies
CREATE TABLE "osce_session_therapies" (
    "id" SERIAL NOT NULL,
    "osce_session_id" INTEGER NOT NULL,
    "therapy" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osce_session_therapies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "osce_rubrics_name_key" ON "osce_rubrics"("name");

-- CreateIndex
CREATE INDEX "osce_observations_group_id_idx" ON "osce_observations"("group_id");

-- CreateIndex
CREATE INDEX "osce_topics_created_by_idx" ON "osce_topics"("created_by");
CREATE INDEX "osce_topics_osce_rubric_id_idx" ON "osce_topics"("osce_rubric_id");
CREATE INDEX "osce_topics_status_idx" ON "osce_topics"("status");
CREATE INDEX "osce_topics_is_active_idx" ON "osce_topics"("is_active");

-- CreateIndex
CREATE INDEX "osce_topic_tags_topic_id_idx" ON "osce_topic_tags"("topic_id");
CREATE INDEX "osce_topic_tags_tag_id_idx" ON "osce_topic_tags"("tag_id");
CREATE UNIQUE INDEX "osce_topic_tags_topic_id_tag_id_key" ON "osce_topic_tags"("topic_id", "tag_id");

-- CreateIndex
CREATE INDEX "osce_topic_observations_topic_id_idx" ON "osce_topic_observations"("topic_id");
CREATE INDEX "osce_topic_observations_observation_id_idx" ON "osce_topic_observations"("observation_id");
CREATE UNIQUE INDEX "osce_topic_observations_topic_id_observation_id_key" ON "osce_topic_observations"("topic_id", "observation_id");

-- CreateIndex
CREATE UNIQUE INDEX "osce_sessions_unique_id_key" ON "osce_sessions"("unique_id");
CREATE INDEX "osce_sessions_unique_id_idx" ON "osce_sessions"("unique_id");
CREATE INDEX "osce_sessions_user_id_idx" ON "osce_sessions"("user_id");
CREATE INDEX "osce_sessions_osce_topic_id_idx" ON "osce_sessions"("osce_topic_id");
CREATE INDEX "osce_sessions_status_idx" ON "osce_sessions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "osce_session_topic_snapshots_osce_session_id_key" ON "osce_session_topic_snapshots"("osce_session_id");
CREATE INDEX "osce_session_topic_snapshots_osce_session_id_idx" ON "osce_session_topic_snapshots"("osce_session_id");

-- CreateIndex
CREATE INDEX "osce_session_tag_snapshots_osce_session_id_tag_id_idx" ON "osce_session_tag_snapshots"("osce_session_id", "tag_id");
CREATE INDEX "osce_session_tag_snapshots_tag_id_idx" ON "osce_session_tag_snapshots"("tag_id");

-- CreateIndex
CREATE INDEX "osce_session_observation_group_snapshots_osce_session_id_group_name_idx" ON "osce_session_observation_group_snapshots"("osce_session_id", "group_name");
CREATE INDEX "osce_session_observation_group_snapshots_group_id_idx" ON "osce_session_observation_group_snapshots"("group_id");

-- CreateIndex
CREATE INDEX "osce_session_observation_snapshots_observation_id_idx" ON "osce_session_observation_snapshots"("observation_id");
CREATE INDEX "osce_session_observation_snapshots_group_snapshot_id_observation_name_idx" ON "osce_session_observation_snapshots"("group_snapshot_id", "observation_name");

-- CreateIndex
CREATE INDEX "osce_session_rubric_snapshots_rubric_id_idx" ON "osce_session_rubric_snapshots"("rubric_id");
CREATE INDEX "osce_session_rubric_snapshots_osce_session_id_idx" ON "osce_session_rubric_snapshots"("osce_session_id");

-- CreateIndex
CREATE INDEX "osce_session_observations_osce_session_id_idx" ON "osce_session_observations"("osce_session_id");
CREATE INDEX "osce_session_observations_observation_snapshot_id_idx" ON "osce_session_observations"("observation_snapshot_id");
CREATE UNIQUE INDEX "osce_session_observations_osce_session_id_observation_snapshot_id_key" ON "osce_session_observations"("osce_session_id", "observation_snapshot_id");

-- CreateIndex
CREATE INDEX "osce_session_messages_osce_session_id_idx" ON "osce_session_messages"("osce_session_id");
CREATE INDEX "osce_session_messages_sender_type_idx" ON "osce_session_messages"("sender_type");
CREATE INDEX "osce_session_messages_created_at_idx" ON "osce_session_messages"("created_at");

-- CreateIndex
CREATE INDEX "osce_session_diagnoses_osce_session_id_idx" ON "osce_session_diagnoses"("osce_session_id");
CREATE INDEX "osce_session_diagnoses_type_idx" ON "osce_session_diagnoses"("type");

-- CreateIndex
CREATE INDEX "osce_session_therapies_osce_session_id_idx" ON "osce_session_therapies"("osce_session_id");
CREATE INDEX "osce_session_therapies_order_idx" ON "osce_session_therapies"("order");

-- AddForeignKey
ALTER TABLE "osce_observations" ADD CONSTRAINT "osce_observations_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "osce_observation_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osce_topics" ADD CONSTRAINT "osce_topics_osce_rubric_id_fkey" FOREIGN KEY ("osce_rubric_id") REFERENCES "osce_rubrics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osce_topic_tags" ADD CONSTRAINT "osce_topic_tags_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "osce_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osce_topic_tags" ADD CONSTRAINT "osce_topic_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osce_topic_observations" ADD CONSTRAINT "osce_topic_observations_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "osce_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osce_topic_observations" ADD CONSTRAINT "osce_topic_observations_observation_id_fkey" FOREIGN KEY ("observation_id") REFERENCES "osce_observations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osce_sessions" ADD CONSTRAINT "osce_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osce_sessions" ADD CONSTRAINT "osce_sessions_osce_topic_id_fkey" FOREIGN KEY ("osce_topic_id") REFERENCES "osce_topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osce_session_topic_snapshots" ADD CONSTRAINT "osce_session_topic_snapshots_osce_session_id_fkey" FOREIGN KEY ("osce_session_id") REFERENCES "osce_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osce_session_tag_snapshots" ADD CONSTRAINT "osce_session_tag_snapshots_osce_session_id_fkey" FOREIGN KEY ("osce_session_id") REFERENCES "osce_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osce_session_tag_snapshots" ADD CONSTRAINT "osce_session_tag_snapshots_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osce_session_observation_group_snapshots" ADD CONSTRAINT "osce_session_observation_group_snapshots_osce_session_id_fkey" FOREIGN KEY ("osce_session_id") REFERENCES "osce_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osce_session_observation_snapshots" ADD CONSTRAINT "osce_session_observation_snapshots_group_snapshot_id_fkey" FOREIGN KEY ("group_snapshot_id") REFERENCES "osce_session_observation_group_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osce_session_rubric_snapshots" ADD CONSTRAINT "osce_session_rubric_snapshots_rubric_id_fkey" FOREIGN KEY ("rubric_id") REFERENCES "osce_rubrics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osce_session_rubric_snapshots" ADD CONSTRAINT "osce_session_rubric_snapshots_osce_session_id_fkey" FOREIGN KEY ("osce_session_id") REFERENCES "osce_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osce_session_observations" ADD CONSTRAINT "osce_session_observations_osce_session_id_fkey" FOREIGN KEY ("osce_session_id") REFERENCES "osce_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osce_session_observations" ADD CONSTRAINT "osce_session_observations_observation_snapshot_id_fkey" FOREIGN KEY ("observation_snapshot_id") REFERENCES "osce_session_observation_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osce_session_messages" ADD CONSTRAINT "osce_session_messages_osce_session_id_fkey" FOREIGN KEY ("osce_session_id") REFERENCES "osce_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osce_session_diagnoses" ADD CONSTRAINT "osce_session_diagnoses_osce_session_id_fkey" FOREIGN KEY ("osce_session_id") REFERENCES "osce_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osce_session_therapies" ADD CONSTRAINT "osce_session_therapies_osce_session_id_fkey" FOREIGN KEY ("osce_session_id") REFERENCES "osce_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
