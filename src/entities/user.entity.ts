import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users') // Table name in the database
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ type: 'varchar', length: 255, nullable: false })
  username: string;
  
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;
  
  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;
  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
