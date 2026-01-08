import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
  ) { }

  async listAll() {
    return this.appointmentsRepository.find({
      relations: ['dietitian', 'client'],
      order: { appointmentDate: 'DESC' },
    });
  }

  async getByDietitian(dietitianId: number) {
    console.log('APPOINTMENTS.getByDietitian called with', { dietitianId });
    return this.appointmentsRepository.find({
      where: { dietitianId },
      relations: ['client'],
      order: { appointmentDate: 'DESC' },
    });
  }

  async getByClient(clientId: number) {
    return this.appointmentsRepository.find({
      where: { clientId },
      relations: ['dietitian'],
      order: { appointmentDate: 'DESC' },
    });
  }

  async getOne(id: number) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['dietitian', 'client'],
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async create(createDto: CreateAppointmentDto, userId: number, userRole: string) {
    console.log('APPOINTMENTS.create called with', { createDto, userId, userRole });
    let appointment;

    if (userRole === 'DIYETISYEN') {
      appointment = this.appointmentsRepository.create({
        ...createDto,
        dietitianId: userId,
      });
    } else if (userRole === 'DANISAN') {
      appointment = this.appointmentsRepository.create({
        appointmentDate: createDto.appointmentDate,
        notes: createDto.notes,
        clientId: userId,
        dietitianId: createDto.dietitianId,
      });
    } else {
      throw new Error('Invalid user role for appointment creation');
    }

    try {
      console.log('APPOINTMENTS.appointment object before save:', appointment);
      const saved = await this.appointmentsRepository.save(appointment);
      console.log('APPOINTMENTS.appointment saved successfully:', saved);
      return saved;
    } catch (error) {
      console.error('APPOINTMENTS.create error:', error.message);
      console.error('APPOINTMENTS.create error details:', error);
      throw error;
    }
  }

  async update(id: number, updateDto: UpdateAppointmentDto, userId: number, userRole: string) {
    const appointment = await this.getOne(id);

    if (
      (userRole === 'DIYETISYEN' && appointment.dietitianId !== userId) ||
      (userRole === 'DANISAN' && appointment.clientId !== userId)
    ) {
      throw new ForbiddenException('You can only update your own appointments');
    }

    Object.assign(appointment, updateDto);
    return this.appointmentsRepository.save(appointment);
  }

  async delete(id: number, userId: number, userRole: string) {
    const appointment = await this.getOne(id);

    if (
      (userRole === 'DIYETISYEN' && appointment.dietitianId !== userId) ||
      (userRole === 'DANISAN' && appointment.clientId !== userId)
    ) {
      throw new ForbiddenException('You can only delete your own appointments');
    }

    return this.appointmentsRepository.delete(id);
  }
}