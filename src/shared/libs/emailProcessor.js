


import { processScheduledEmails } from "./emailWorker";

let isRunning = false; // Prevent overlapping runs

async function runProcessor() {
  if (isRunning) {
    console.warn(`[${new Date().toISOString()}] Previous job still running, skipping...`);
    return;
  }

  console.log(`[${new Date().toISOString()}] Running scheduled email processor...`);
  isRunning = true;

  try {
    await processScheduledEmails();
    console.log(`[${new Date().toISOString()}] Scheduled email processing completed.`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error during email processing:`, error);
  } finally {
    isRunning = false;
  }
}

// Run immediately on startup
runProcessor();

// Then run every minute
setInterval(runProcessor, 60 * 1000);
