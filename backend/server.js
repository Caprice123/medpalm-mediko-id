import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { startCronJobs } from './jobs/cron.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import authRoutes from './routes/api/v1/auth.routes.js';
import creditRoutes from './routes/credit.routes.js';
import creditPlanRoutes from './routes/api/v1/creditPlan.routes.js';
import exerciseRoutes from './routes/api/v1/exercise.routes.js';
import exerciseAttemptRoutes from './routes/api/v1/exercises/attempts.routes.js';
import flashcardRoutes from './routes/api/v1/flashcard.routes.js';
import summaryNoteRoutes from './routes/api/v1/summaryNote.routes.js';
import tagRoutes from './routes/api/v1/tag.routes.js';
import tagGroupRoutes from './routes/api/v1/tagGroup.routes.js';
import sessionRoutes from './routes/api/v1/session.routes.js';
import featureRoutes from './routes/api/v1/feature.routes.js';
import statisticRoutes from './routes/api/v1/statistic.routes.js';
import pricingRoutes from './routes/api/v1/pricing.routes.js';
import adminCreditPlanRoutes from './routes/admin/v1/creditPlan.routes.js';
import adminPricingRoutes from './routes/admin/v1/pricing.routes.js';
import adminExerciseRoutes from './routes/admin/v1/exercise.routes.js';
import adminFlashcardRoutes from './routes/admin/v1/flashcard.routes.js';
import adminSummaryNoteRoutes from './routes/admin/v1/summaryNote.routes.js';
import adminConstantRoutes from './routes/admin/v1/constant.routes.js';
import calculatorRoutes from './routes/api/v1/calculator.routes.js';
import anatomyRoutes from './routes/api/v1/anatomy.routes.js';
import mcqRoutes from './routes/api/v1/mcq.routes.js';
import adminCalculatorRoutes from './routes/admin/v1/calculator.routes.js';
import adminTagsRoutes from './routes/admin/v1/tag.routes.js';
import adminTagGroupsRoutes from './routes/admin/v1/tagGroup.routes.js';
import adminUsersRoutes from './routes/admin/v1/users.routes.js';
import adminAnatomyRoutes from './routes/admin/v1/anatomy.routes.js';
import adminMcqRoutes from './routes/admin/v1/mcq.routes.js';
import webhookRoutes from './routes/webhook.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
app.use('/api/credits', creditRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/v1/credit-plans', creditPlanRoutes);
app.use('/api/v1/exercises', exerciseRoutes);
app.use('/api/v1/exercises/attempts', exerciseAttemptRoutes);
app.use('/api/v1/flashcards', flashcardRoutes);
app.use('/api/v1/summary-notes', summaryNoteRoutes);
app.use('/api/v1/tags', tagRoutes);
app.use('/api/v1/tag-groups', tagGroupRoutes);
app.use('/api/v1/sessions', sessionRoutes);
app.use('/api/v1/features', featureRoutes);
app.use('/api/v1/statistics', statisticRoutes);
app.use('/api/v1/pricing', pricingRoutes);
app.use('/api/v1/calculators', calculatorRoutes);
app.use('/api/v1/anatomy', anatomyRoutes);
app.use('/api/v1/mcq', mcqRoutes);

// Admin Routes
app.use('/admin/v1/credit-plans', adminCreditPlanRoutes);
app.use('/admin/v1/pricing', adminPricingRoutes);
app.use('/admin/v1/exercises', adminExerciseRoutes);
app.use('/admin/v1/flashcards', adminFlashcardRoutes);
app.use('/admin/v1/summary-notes', adminSummaryNoteRoutes);
app.use('/admin/v1/constants', adminConstantRoutes);
app.use('/admin/v1/calculators', adminCalculatorRoutes);
app.use('/admin/v1/tags', adminTagsRoutes);
app.use('/admin/v1/tag-groups', adminTagGroupsRoutes);
app.use('/admin/v1/users', adminUsersRoutes);
app.use('/admin/v1/anatomy', adminAnatomyRoutes);
app.use('/admin/v1/mcq', adminMcqRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Start cron jobs
  startCronJobs();
});
