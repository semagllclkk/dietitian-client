import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'appointment' })
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  appointmentDate: Date;

  @Column({ default: 'PENDING' })
  status: string;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne('User', 'dietitianAppointments')
  dietitian: any;

  @Column()
  dietitianId: number;

  @ManyToOne('User', 'clientAppointments')
  client: any;

  @Column()
  clientId: number;
}