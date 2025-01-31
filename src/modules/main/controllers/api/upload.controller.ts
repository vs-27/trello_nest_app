import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Repository } from 'typeorm';
import { CreateFileDto } from '../../dto/file.dto';
import { FileEntity } from '../../entities/file.entity';
import { TaskEntity } from '../../entities/task.entity';
import { UploadService } from '../../services/upload.service';

@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @InjectRepository(TaskEntity)
  private readonly taskRepository: Repository<TaskEntity>;

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))

  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { taskId: number }
  ): Promise<FileEntity> {

    const task = await this.taskRepository.findOne({
      where: { id: body.taskId },
      relations: [ 'files' ],
    });

    if (!task) {
      throw new Error('Task not found');
    }

    const fileDto: CreateFileDto = {
      fileName: file.filename,
      filePath: file.path,
      taskId: body.taskId,
    };

    return this.uploadService.saveFileData(task, fileDto);
  }

}
