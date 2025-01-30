import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ColumnEntity } from './column.entity';

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
}
