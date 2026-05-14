import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users') // explicitly map to `users` table
export class User {
  @PrimaryGeneratedColumn() // auto-increment primary key
  accountId!: number;

  @Column({ unique: true }) // username must be unique
  username!: string;

  @Column({ unique: true, nullable: true }) // email can be unique, optional
  email?: string;

  @Column() // store hashed password
  passwordHash!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // auto-set on creation
  registrationDate!: Date;

  @Column({ type: 'timestamp', nullable: true }) // updated when user logs in
  lastLogin?: Date;

  @Column({ nullable: true }) // last known IP address
  ipAddress?: string;

  @Column({ default: 'active' }) // account status: active, banned, suspended
  accountStatus!: string;

  @Column({ default: 'player' }) // role: player, moderator, admin
  role!: string;

  @Column({ default: 0 }) // VIP level, default 0
  vipLevel!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) // currency balance
  currencyBalance!: number;
}
