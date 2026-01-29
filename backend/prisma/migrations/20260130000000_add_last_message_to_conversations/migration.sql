-- Add last_message column to chatbot_conversations table
ALTER TABLE "chatbot_conversations" ADD COLUMN "last_message" VARCHAR(50);
