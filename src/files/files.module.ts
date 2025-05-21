// src/files/files.module.ts
import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
// import { PrismaService } from '../db/prisma.service';
import { BullModule } from '@nestjs/bullmq';
import { PrismaService } from 'src/prisma.service';
import { QueueService } from 'src/jobs/queue.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'file-processing-queue',
      connection: {
        host: 'localhost',
        port: 6379,
        maxRetriesPerRequest: null,
      },
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService, PrismaService, QueueService],
})
export class FilesModule {}
