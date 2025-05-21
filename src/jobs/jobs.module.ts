import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'file-processing-queue',
      connection: {
        host: 'localhost',
        port: 6379,
        maxRetriesPerRequest: null, // Required
      },
    }),
  ],
})
export class JobsModule {}
