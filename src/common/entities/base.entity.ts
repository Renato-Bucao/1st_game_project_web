import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number; // unique identifier

  @CreateDateColumn({ name: 'created_date' })
  createdDate!: Date; // auto-set when record is created

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate!: Date; // auto-update when record is modified
}