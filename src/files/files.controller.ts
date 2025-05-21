// src/files/files.controller.ts

import {
  Controller,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Body,
  Request,
  Get,
  Param,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesService } from './files.service';
import { extname } from 'path';
const fs = require('fs');

@ApiTags('files')
@ApiBearerAuth()
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // Endpoint for uploading a file
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        title: { type: 'string', example: 'My File' },
        description: { type: 'string', example: 'This is a test file' }, 
      },
      required: ['file'], // ensures file is required, no empty value allowed
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully.' })
  @UseGuards(JwtAuthGuard) // Protect route with JWT authentication
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = './uploads';
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath); // Save files to 'uploads' directory
      },
      filename: (req, file, cb) => {
        // Generate a unique filename using timestamp and random number
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname); // Preserve original file extension
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File, // Uploaded file object
    @Body() body: { title?: string; description?: string }, // Optional metadata
    @Request() req // Request object to access user info
  ) {
    // Delegate file handling to service, passing user ID for ownership
    return this.filesService.handleUpload(file, body, req.user.userId);
  }



  // Endpoint for retrieving a file by its ID
  @ApiOperation({ summary: 'Get file by ID' })
  @ApiResponse({ status: 200, description: 'File details.' })
  @UseGuards(JwtAuthGuard) // Protect route with JWT authentication
  @Get(':id')
  async getFileById(@Param('id') id: number, @Request() req) {
    const file = await this.filesService.getFileById(id); // Fetch file from service
    if (!file) {
      throw new NotFoundException('File not found'); // Throw if file doesn't exist
    }
    if (file.userId !== req.user.userId) {
      // Ensure user owns the file
      throw new UnauthorizedException('You do not have permission to access this file');
    }
    return file; // Return file details
  }
}
