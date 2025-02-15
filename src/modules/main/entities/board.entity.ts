import {
  Entity,
  PrimaryGeneratedColumn,
  Column, ManyToOne, OneToMany,
} from 'typeorm';
import { BoardMessageEntity } from './boardMessage.entity';
import { ColumnEntity } from './column.entity';
import { UserEntity } from './user.entity';

@Entity('boards')
export class BoardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar' })
  color: string;

  @Column({ type: 'varchar', length: 255 })
  font: string;

  @Column({ type: 'varchar' })
  backgroundColor: string;

  @ManyToOne(() => UserEntity, (user) => user.boards)
  createdBy: UserEntity;

  @OneToMany(() => ColumnEntity, (column) => column.board)
  columns: ColumnEntity[];

  @OneToMany(() => BoardMessageEntity, (message) => message.board)
  messages: BoardMessageEntity[];
}
