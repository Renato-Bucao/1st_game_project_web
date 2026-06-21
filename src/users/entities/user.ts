import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column, Unique } from 'typeorm';

@Entity('users')
@Unique(['username'])
@Unique(['email'])
export class User extends BaseEntity {
  
  @Column({ nullable: false })
  username!: string;

  @Column({ nullable: false })
  email!: string;

  @Column({ nullable: false, select: false })
  password!: string;

  @Column({ default: 'active', nullable: false })
  status!: string;

  @Column({ default: 'user', nullable: false })
  role!: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin?: Date;   // ✅ add this

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  resetToken?: string;
}
