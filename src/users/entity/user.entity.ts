import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn() // default auto-increment integer
  id!: number;   // definite assignment assertion

  @Column()
  name!: string; // definite assignment assertion

  @Column({ nullable: true })
  email!: string;
}

