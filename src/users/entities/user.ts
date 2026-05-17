import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {

  @Column({
    nullable: false,
    unique: true
  })
  username!: string;                                                       // unique username for login/identification

   @Column({
    nullable: false,
  })
  password!: string;                                                       // store hashed password (never plain text)

 @Column({
    nullable: false,
    unique: true
  })
  email!: string;                                                          // user’s email, must be unique                                            // auto-set when account is created

  @Column({
    type: 'varchar',
    length: 20,
    default: 'active',
    nullable: false
  }) 
  status!: string;                                                 // account lifecycle status (active, banned, suspended)

  @Column({
    type: 'varchar',
    length: 50,
    default: 'user',
    nullable: false
  })
  role!: string;                                                          // defines role in system (user, admin, moderator)

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP'  //temporary default, will be updated on login
  }) 
  lastLogin!: Date;                                                       // updated when user logs in

  @Column({
    nullable: false,
  }) 
  ipAddress!: string;                                                    // last known IP address of user

}
