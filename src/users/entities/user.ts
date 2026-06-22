import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column, Unique, } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
 @Column({ nullable: false, unique: true })
  username!: string;

  @Column({ nullable: false, select: false })
  password!: string;    // ✅ hashed before save

  @Column({ nullable: false, unique: true })
  email!: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin?: Date;     // ✅ updated on login

  @Column({ nullable: true })
  ipAddress?: string;   // ✅ detect from req.ip

  @Column({ nullable: true })
  resetToken?: string;  // ✅ set on forgot password, expires in 1h

  @Column({ default: 'pending', nullable: false })
  status!: string;      // ✅ default pending

  @Column({ default: 'user', nullable: false })
  role!: string;        // ✅ default user

  @Column({ nullable: true })
  verificationToken?: string; // ✅ set on register, expires in 1h
}
