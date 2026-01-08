import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  appointmentDate: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  dietitianId?: number;

  @IsOptional()
  @IsNumber()
  clientId?: number;
}