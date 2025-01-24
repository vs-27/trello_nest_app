import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('purchase')
export class PurchaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', precision: 0 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 0 })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 255 })
  stripeProductPriceId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'float' })
  totalPrice: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentStatus: string;
}
