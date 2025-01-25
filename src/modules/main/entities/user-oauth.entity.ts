import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn, ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('users-oauth')
export class UserOauthEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: 'json', nullable: true })
  profile: Record<string, any>;
  
  @Column({ type: 'jsonb', default: {} })
  tokensData: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp', precision: 0 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 0 })
  updatedAt: Date;
  
  @ManyToOne(() => UserEntity, (user) => user.oauthProfiles, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
