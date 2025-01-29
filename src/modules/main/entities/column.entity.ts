import {
  Column,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BoardEntity } from './board.entity';

@Entity('columns')
export class ColumnEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @ManyToOne(() => BoardEntity, (board) => board.columns)
  boards: BoardEntity;
}
