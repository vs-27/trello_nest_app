import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFileDto } from '../dto/file.dto';
import { FileEntity } from '../entities/file.entity';
import { TaskEntity } from '../entities/task.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>
  ) {}

  async saveFileData(task: TaskEntity, createFileDto: CreateFileDto): Promise<FileEntity> {
    const fileEntity = this.fileRepository.create(createFileDto);
    fileEntity.task = task;

    return this.fileRepository.save(fileEntity);
  }

}
