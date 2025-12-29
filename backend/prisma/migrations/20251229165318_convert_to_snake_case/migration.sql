-- Convert all camelCase columns to snake_case
-- This migration safely handles columns that may already be in snake_case

DO $$
BEGIN
  -- ============= credit_plans table =============
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='credit_plans' AND column_name='isActive') THEN
    ALTER TABLE "public"."credit_plans" RENAME COLUMN "isActive" TO "is_active";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='credit_plans' AND column_name='isPopular') THEN
    ALTER TABLE "public"."credit_plans" RENAME COLUMN "isPopular" TO "is_popular";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='credit_plans' AND column_name='createdAt') THEN
    ALTER TABLE "public"."credit_plans" RENAME COLUMN "createdAt" TO "created_at";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='credit_plans' AND column_name='updatedAt') THEN
    ALTER TABLE "public"."credit_plans" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;

  -- ============= credit_transactions table =============
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='credit_transactions' AND column_name='userId') THEN
    ALTER TABLE "public"."credit_transactions" RENAME COLUMN "userId" TO "user_id";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='credit_transactions' AND column_name='userCreditId') THEN
    ALTER TABLE "public"."credit_transactions" RENAME COLUMN "userCreditId" TO "user_credit_id";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='credit_transactions' AND column_name='balanceBefore') THEN
    ALTER TABLE "public"."credit_transactions" RENAME COLUMN "balanceBefore" TO "balance_before";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='credit_transactions' AND column_name='balanceAfter') THEN
    ALTER TABLE "public"."credit_transactions" RENAME COLUMN "balanceAfter" TO "balance_after";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='credit_transactions' AND column_name='creditPlanId') THEN
    ALTER TABLE "public"."credit_transactions" RENAME COLUMN "creditPlanId" TO "credit_plan_id";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='credit_transactions' AND column_name='sessionId') THEN
    ALTER TABLE "public"."credit_transactions" RENAME COLUMN "sessionId" TO "session_id";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='credit_transactions' AND column_name='paymentStatus') THEN
    ALTER TABLE "public"."credit_transactions" RENAME COLUMN "paymentStatus" TO "payment_status";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='credit_transactions' AND column_name='paymentMethod') THEN
    ALTER TABLE "public"."credit_transactions" RENAME COLUMN "paymentMethod" TO "payment_method";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='credit_transactions' AND column_name='paymentReference') THEN
    ALTER TABLE "public"."credit_transactions" RENAME COLUMN "paymentReference" TO "payment_reference";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='credit_transactions' AND column_name='createdAt') THEN
    ALTER TABLE "public"."credit_transactions" RENAME COLUMN "createdAt" TO "created_at";
  END IF;

  -- ============= user_sessions table =============
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_sessions' AND column_name='userId') THEN
    ALTER TABLE "public"."user_sessions" RENAME COLUMN "userId" TO "user_id";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_sessions' AND column_name='refreshToken') THEN
    ALTER TABLE "public"."user_sessions" RENAME COLUMN "refreshToken" TO "refresh_token";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_sessions' AND column_name='refreshTokenExpiresAt') THEN
    ALTER TABLE "public"."user_sessions" RENAME COLUMN "refreshTokenExpiresAt" TO "refresh_token_expires_at";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_sessions' AND column_name='isActive') THEN
    ALTER TABLE "public"."user_sessions" RENAME COLUMN "isActive" TO "is_active";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_sessions' AND column_name='userAgent') THEN
    ALTER TABLE "public"."user_sessions" RENAME COLUMN "userAgent" TO "user_agent";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_sessions' AND column_name='ipAddress') THEN
    ALTER TABLE "public"."user_sessions" RENAME COLUMN "ipAddress" TO "ip_address";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_sessions' AND column_name='expiresAt') THEN
    ALTER TABLE "public"."user_sessions" RENAME COLUMN "expiresAt" TO "expires_at";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_sessions' AND column_name='lastActiveAt') THEN
    ALTER TABLE "public"."user_sessions" RENAME COLUMN "lastActiveAt" TO "last_active_at";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_sessions' AND column_name='createdAt') THEN
    ALTER TABLE "public"."user_sessions" RENAME COLUMN "createdAt" TO "created_at";
  END IF;

  -- ============= users table =============
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='googleId') THEN
    ALTER TABLE "public"."users" RENAME COLUMN "googleId" TO "google_id";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='isActive') THEN
    ALTER TABLE "public"."users" RENAME COLUMN "isActive" TO "is_active";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='createdAt') THEN
    ALTER TABLE "public"."users" RENAME COLUMN "createdAt" TO "created_at";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='updatedAt') THEN
    ALTER TABLE "public"."users" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;

  -- ============= user_credits table =============
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_credits' AND column_name='userId') THEN
    ALTER TABLE "public"."user_credits" RENAME COLUMN "userId" TO "user_id";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_credits' AND column_name='createdAt') THEN
    ALTER TABLE "public"."user_credits" RENAME COLUMN "createdAt" TO "created_at";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='user_credits' AND column_name='updatedAt') THEN
    ALTER TABLE "public"."user_credits" RENAME COLUMN "updatedAt" TO "updated_at";
  END IF;

  -- ============= attachments table =============
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='attachments' AND column_name='recordType') THEN
    ALTER TABLE "public"."attachments" RENAME COLUMN "recordType" TO "record_type";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='attachments' AND column_name='recordId') THEN
    ALTER TABLE "public"."attachments" RENAME COLUMN "recordId" TO "record_id";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='attachments' AND column_name='blobId') THEN
    ALTER TABLE "public"."attachments" RENAME COLUMN "blobId" TO "blob_id";
  END IF;

  -- ============= blobs table =============
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='blobs' AND column_name='contentType') THEN
    ALTER TABLE "public"."blobs" RENAME COLUMN "contentType" TO "content_type";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='blobs' AND column_name='byteSize') THEN
    ALTER TABLE "public"."blobs" RENAME COLUMN "byteSize" TO "byte_size";
  END IF;

  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='blobs' AND column_name='uploadedAt') THEN
    ALTER TABLE "public"."blobs" RENAME COLUMN "uploadedAt" TO "uploaded_at";
  END IF;
END$$;
