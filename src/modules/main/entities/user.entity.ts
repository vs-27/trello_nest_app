import { hash } from 'bcrypt';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert, OneToMany, JoinTable,
} from 'typeorm';
import { BoardEntity } from './board.entity';
import { BoardMessageEntity } from './boardMessage.entity';
import { UserOauthEntity } from './user-oauth.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName: string|null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName: string|null;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @CreateDateColumn({ type: 'timestamp', precision: 0 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 0 })
  updatedAt: Date;

  @OneToMany(() => UserOauthEntity, (userOauth) => userOauth.user, {
    cascade: true,
  })
  oauthProfiles: UserOauthEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @OneToMany(() => BoardEntity, (board) => board.createdBy, { eager: true })
  @JoinTable()
  boards: BoardEntity[];

  @OneToMany(() => BoardMessageEntity, (message) => message.user, { eager: true })
  messages: BoardMessageEntity[];
}
