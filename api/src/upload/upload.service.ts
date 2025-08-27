import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  constructor() {
    // Tạo thư mục uploads nếu chưa tồn tại
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
    if (!file) {
      throw new BadRequestException('Không có file nào được upload');
    }

    // Tạo URL để truy cập file
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/uploads/${file.filename}`;

    return {
      url,
      filename: file.filename,
    };
  }

  async deleteFile(filename: string): Promise<void> {
    // Có thể thêm logic xóa file ở đây nếu cần
    // const filePath = join(process.cwd(), 'uploads', filename);
    // if (existsSync(filePath)) {
    //   unlinkSync(filePath);
    // }
  }
}
