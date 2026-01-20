import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initSentry, sentryRequestHandler, sentryTracingHandler, sentryErrorHandler } from '#config/sentry';
import { startCronJobs } from '#jobs/cron';
import { errorHandler } from '#middleware/errorHandler.middleware';
import authRoutes from '#routes/api/v1/auth.routes';
import creditPlanRoutes from '#routes/api/v1/creditPlan.routes';
import exerciseRoutes from '#routes/api/v1/exercise.routes';
import flashcardRoutes from '#routes/api/v1/flashcard.routes';
import summaryNoteRoutes from '#routes/api/v1/summaryNote.routes';
import tagRoutes from '#routes/api/v1/tag.routes';
import tagGroupRoutes from '#routes/api/v1/tagGroup.routes';
import featureRoutes from '#routes/api/v1/feature.routes';
import pricingRoutes from '#routes/api/v1/pricing.routes';
import adminCreditPlanRoutes from '#routes/admin/v1/creditPlan.routes';
import adminCreditsRoutes from '#routes/admin/v1/credits.routes';
import adminPricingRoutes from '#routes/admin/v1/pricing.routes';
import adminExerciseRoutes from '#routes/admin/v1/exercise.routes';
import adminFlashcardRoutes from '#routes/admin/v1/flashcard.routes';
import adminSummaryNoteRoutes from '#routes/admin/v1/summaryNote.routes';
import adminConstantRoutes from '#routes/admin/v1/constant.routes';
import calculatorRoutes from '#routes/api/v1/calculator.routes';
import anatomyRoutes from '#routes/api/v1/anatomy.routes';
import sessionRoutes from '#routes/api/v1/oscePractice/sessions.routes';
import topicRoutes from '#routes/api/v1/oscePractice/topics.routes';
import mcqRoutes from '#routes/api/v1/mcq.routes';
import adminCalculatorRoutes from '#routes/admin/v1/calculator.routes';
import adminTagsRoutes from '#routes/admin/v1/tag.routes';
import adminTagGroupsRoutes from '#routes/admin/v1/tagGroup.routes';
import adminUsersRoutes from '#routes/admin/v1/users.routes';
import adminSubscriptionsRoutes from '#routes/admin/v1/subscriptions.routes';
import adminAnatomyRoutes from '#routes/admin/v1/anatomy.routes';
import adminMcqRoutes from '#routes/admin/v1/mcq.routes';
import chatbotRoutes from '#routes/api/v1/chatbot.routes';
import adminChatbotRoutes from '#routes/admin/v1/chatbot.routes';
import adminOscePracticeTopicRoutes from '#routes/admin/v1/oscePractice/topic.routes';
import adminOscePracticeRubricRoutes from '#routes/admin/v1/oscePractice/rubric.routes';
import adminOscePracticeObservationRoutes from '#routes/admin/v1/oscePractice/observation.routes';
import adminOscePracticeObservationGroupRoutes from '#routes/admin/v1/oscePractice/observationGroup.routes';
import skripsiRoutes from '#routes/api/v1/skripsi.routes';
import adminSkripsiRoutes from '#routes/admin/v1/skripsi.routes';
import uploadRoutes from '#routes/api/v1/upload.routes';
import blobRoutes from '#routes/api/v1/blobs.routes';
import htmlToDocxRoutes from '#routes/api/v1/htmlToDocx.routes';
import webhookRoutes from '#routes/webhook/v1/xendit.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Sentry (must be first)
initSentry(app);

// Sentry request handler (must be the first middleware)
app.use(sentryRequestHandler());

// Sentry tracing handler (must be after request handler)
app.use(sentryTracingHandler());

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' })); // Increase limit for large file uploads
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MedPalm API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', authRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/v1/credit-plans', creditPlanRoutes);
app.use('/api/v1/exercises', exerciseRoutes);
app.use('/api/v1/flashcards', flashcardRoutes);
app.use('/api/v1/summary-notes', summaryNoteRoutes);
app.use('/api/v1/tags', tagRoutes);
app.use('/api/v1/tag-groups', tagGroupRoutes);
app.use('/api/v1/features', featureRoutes);
app.use('/api/v1/pricing', pricingRoutes);
app.use('/api/v1/calculators', calculatorRoutes);
app.use('/api/v1/anatomy', anatomyRoutes);
app.use('/api/v1/mcq', mcqRoutes);
app.use('/api/v1/chatbot', chatbotRoutes);
app.use('/api/v1/oscePractice/topics', topicRoutes);
app.use('/api/v1/oscePractice/sessions', sessionRoutes);
app.use('/api/v1', uploadRoutes);
app.use('/api/v1/blobs', blobRoutes);
app.use('/api/v1', skripsiRoutes);
app.use('/api/v1/html-to-docx', htmlToDocxRoutes);

// Admin Routes
app.use('/admin/v1/credit-plans', adminCreditPlanRoutes);
app.use('/admin/v1/credits', adminCreditsRoutes);
app.use('/admin/v1/pricing', adminPricingRoutes);
app.use('/admin/v1/exercises', adminExerciseRoutes);
app.use('/admin/v1/flashcards', adminFlashcardRoutes);
app.use('/admin/v1/summary-notes', adminSummaryNoteRoutes);
app.use('/admin/v1/constants', adminConstantRoutes);
app.use('/admin/v1/calculators', adminCalculatorRoutes);
app.use('/admin/v1/tags', adminTagsRoutes);
app.use('/admin/v1/tag-groups', adminTagGroupsRoutes);
app.use('/admin/v1/users', adminUsersRoutes);
app.use('/admin/v1/oscePractice/topics', adminOscePracticeTopicRoutes);
app.use('/admin/v1/oscePractice/rubrics', adminOscePracticeRubricRoutes);
app.use('/admin/v1/oscePractice/observations', adminOscePracticeObservationRoutes);
app.use('/admin/v1/oscePractice/observation-groups', adminOscePracticeObservationGroupRoutes);
app.use('/admin/v1/subscriptions', adminSubscriptionsRoutes);
app.use('/admin/v1/anatomy', adminAnatomyRoutes);
app.use('/admin/v1/mcq', adminMcqRoutes);
app.use('/admin/v1/chatbot', adminChatbotRoutes);
app.use('/admin/v1', adminSkripsiRoutes);

// Sentry error handler (must be before other error handlers)
app.use(sentryErrorHandler());

// Custom error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Start cron jobs
  startCronJobs();
});
