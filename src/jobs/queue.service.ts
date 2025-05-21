// src/jobs/queue.service.ts

import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

@Injectable()
export class QueueService implements OnModuleDestroy {
  // Create a new Redis connection instance
  private readonly redisConnection = new IORedis();
  // Define a BullMQ queue for file processing jobs
  public readonly fileQueue: Queue;

  constructor() {
    // Initialize the queue with the Redis connection
    this.fileQueue = new Queue('file-processing', {
      connection: this.redisConnection,
    });
  }

  // Add a new job to the queue with the given fileId
  async enqueue(fileId: number) {
    await this.fileQueue.add('process-file', { fileId });
  }

  // Gracefully close the queue and Redis connection when the module is destroyed
  async onModuleDestroy() {
    await this.fileQueue.close();
    await this.redisConnection.quit();
  }
}
