import { Worker } from 'bullmq';
import IORedis from 'ioredis';

// Create a Redis connection instance with unlimited retries
const connection = new IORedis({ maxRetriesPerRequest: null });

// Create a BullMQ worker to process jobs from the 'file-processing' queue
const worker = new Worker('file-processing', async job => {
  const { fileId } = job.data; // Extract fileId from the job data

  console.log(`Processing file with ID: ${fileId}`);

  // Simulate file processing with a 2-second delay
  await new Promise(res => setTimeout(res, 2000));

  console.log(`Finished processing file with ID: ${fileId}`);
}, { connection });

// Listen for the 'completed' event and log when a job finishes successfully
worker.on('completed', job => {
  console.log(`Job completed for file ID: ${job.data.fileId}`);
});

// Listen for the 'failed' event and log when a job fails
worker.on('failed', (job, err) => {
  console.error(`Job failed for file ID: ${job?.data?.fileId}`, err);
});
