import { Column, Entity, OneToMany, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm'; // 👈 BeforeInsert eklendi
import * as bcrypt from 'bcrypt'; // 👈 Bcrypt eklendi (veya 'bcryptjs')

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: 'DANISAN' })
  role: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @OneToMany('DietPlan', 'dietitian', { nullable: true })
  createdDietPlans: any[];

  @OneToMany('DietPlan', 'client', { nullable: true })
  assignedDietPlans: any[];

  @OneToMany('Appointment', 'dietitian', { nullable: true })
  dietitianAppointments: any[];

  @OneToMany('Appointment', 'client', { nullable: true })
  clientAppointments: any[];

  @BeforeInsert()
  async hashPassword() {
    if (!this.password.startsWith('$2b$') && !this.password.startsWith('$2a$')) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}