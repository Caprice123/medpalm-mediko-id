import cron from 'node-cron';
import prisma from '#prisma/client';

// Example: Run every day at midnight
const dailyCleanupJob = cron.schedule('0 0 * * *', async () => {
  console.log('Running daily cleanup job at:', new Date().toISOString());

  try {
    // Example: Delete queries older than 30 days
    // const thirtyDaysAgo = new Date();
    // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // const result = await prisma.query.deleteMany({
    //   where: {
    //     createdAt: {
    //       lt: thirtyDaysAgo
    //     }
    //   }
    // });

    // console.log(`Deleted ${result.count} old queries`);
  } catch (error) {
    console.error('Error running daily cleanup job:', error);
  }
}, {
  scheduled: false // Don't start automatically, we'll start it manually
});

// Example: Run every 5 minutes
const healthCheckJob = cron.schedule('*/5 * * * *', () => {
  console.log('Health check running at:', new Date().toISOString());
  // Add your health check logic here
}, {
  scheduled: false
});

// Function to start all cron jobs
export const startCronJobs = () => {
  console.log('Starting cron jobs...');
  dailyCleanupJob.start();
  healthCheckJob.start();
  console.log('All cron jobs started successfully');
};

// Function to stop all cron jobs
export const stopCronJobs = () => {
  console.log('Stopping cron jobs...');
  dailyCleanupJob.stop();
  healthCheckJob.stop();
  console.log('All cron jobs stopped');
};

export default {
  startCronJobs,
  stopCronJobs
};
