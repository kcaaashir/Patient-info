import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { imageResponse } from './interface/image-response-interface';
@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<imageResponse> {
    return new Promise((resolve, reject) => {
      try {
        const upload = v2.uploader.upload_stream((error, result) => {
          if (error) {
            return reject(error);
          }
          const resizedImageURL = v2.image(result.public_id, {
            transformation: [{ width: 100, height: 100, crop: 'fill' }],
          });
          const resizedImage = {
            url: resizedImageURL,
            public_id: result.public_id,
          };
          resolve(resizedImage);
        });
        toStream(file.buffer).pipe(upload);
      } catch (e) {
        throw new HttpException({ message: e }, HttpStatus.BAD_REQUEST);
      }
    });
  }

  async deleteImage(public_id: string) {
    try {
      v2.uploader.destroy(public_id, (result) => {
        console.log(result);
      });
    } catch (e) {
      throw new HttpException({ message: e }, HttpStatus.BAD_REQUEST);
    }
  }
}
