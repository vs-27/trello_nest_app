import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ColumnEntity } from './column.entity';
import { FileEntity } from './file.entity';

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  link: string;

  @Column()
  estimation: string;

  @CreateDateColumn()
  startTime: Date;

  @CreateDateColumn()
  endTime: Date;

  @ManyToOne(() => ColumnEntity, (column) => column.tasks)
  column: ColumnEntity;

  @OneToMany(() => FileEntity, (file) => file.task)
  files: FileEntity[];
}
