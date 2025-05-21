import { Injectable } from '@nestjs/common';
import { QueueService } from 'src/jobs/queue.service';
import { PrismaService } from 'src/prisma.service';
// import { QueueService } from '../jobs/queue.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queueService: QueueService,
  ) { }

  /**
   * Handles the file upload process.
   * @param file The uploaded file.
   * @param body The request body containing title and description.
   * @param userId The ID of the user uploading the file.
   * @returns The file ID and status.
   */
  async handleUpload(
    file: Express.Multer.File,
    body: { title?: string; description?: string },
    userId: number
  ) {
    const newFile = await this.prisma.file.create({
      data: {
        userId,
        originalFilename: file.originalname,
        storagePath: file.path,
        title: body.title,
        description: body.description,
        status: 'uploaded',
      },
    });

    // Adding job to queue
    await this.queueService.enqueue(newFile.id);

    return {
      fileId: newFile.id,
      status: newFile.status,
    };
  }

  /**
   * Retrieves a file by its ID.
   * @param id The ID of the file.
   * @returns The file details.
   */
  async getFileById(id: number) {
    return this.prisma.file.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        userId: true,
        originalFilename: true,
        storagePath: true,
        title: true,
        description: true,
        status: true,
        extractedData: true,
        uploadedAt: true,
      },
    });
  }
}
