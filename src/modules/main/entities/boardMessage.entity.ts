import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BoardEntity } from './board.entity';
import { UserEntity } from './user.entity';

@Entity('messages')
export class BoardMessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.messages, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => BoardEntity, (board) => board.messages, { onDelete: 'CASCADE' })
  board: BoardEntity;
}
