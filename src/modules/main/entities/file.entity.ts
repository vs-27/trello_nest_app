import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskEntity } from './task.entity';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  fileName: string;

  @Column({ type: 'varchar' })
  filePath: string;

  @ManyToOne(() => TaskEntity, (task) => task.files, { onDelete: 'CASCADE', nullable: false })
  task: TaskEntity;
}
