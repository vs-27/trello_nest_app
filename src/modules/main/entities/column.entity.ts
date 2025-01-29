import {
  Column,
  Entity, ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BoardEntity } from './board.entity';
import { TaskEntity } from './task.entity';

@Entity('columns')
export class ColumnEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @ManyToOne(() => BoardEntity, (board) => board.columns)
  board: BoardEntity;

  @OneToMany(() => TaskEntity, (task) => task.column)
  tasks: TaskEntity[];
}
