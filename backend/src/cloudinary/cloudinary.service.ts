import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
    constructor(private config: ConfigService) {
        cloudinary.config({
            cloud_name: config.get('CLOUDINARY_CLOUD_NAME'),
            api_key: config.get('CLOUDINARY_API_KEY'),
            api_secret: config.get('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadImage(
        file: Express.Multer.File,
        folder: string,
    ): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'auto',
                // จำกัดขนาดไฟล์ 5MB
                transformation: [{ quality: 'auto', fetch_format: 'auto' }],
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result!);
            },
        );
        // แปลง buffer เป็น stream แล้วส่งให้ cloudinary
        Readable.from(file.buffer).pipe(upload);
        });
    }

    async deleteImage(publicId: string): Promise<void> {
        await cloudinary.uploader.destroy(publicId);
    }
}