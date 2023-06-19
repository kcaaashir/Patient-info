import {
  Post,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Controller,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse } from '@nestjs/swagger';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly uploadImageService: ImageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { limits: { files: 1 } }))
  @ApiResponse({ status: HttpStatus.CREATED })
  async upload(@UploadedFile() file: Express.Multer.File, @Res() response) {
    try {
      const data = await this.uploadImageService.upload(file);
      return response.status(200).json({
        message: `Image ${file.originalname} uploaded to S3`,
        data,
      });
    } catch (error) {
      return response
        .status(500)
        .json({ message: `Failed to upload image to S3: ${error.message}` });
    }
  }
}
