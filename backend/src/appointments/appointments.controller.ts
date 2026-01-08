import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.decorator';

@Controller('appointments')
@UseGuards(AuthGuard('jwt'))
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Get()
  @UseGuards(RolesGuard)
  @Role('ADMIN')
  listAll() {
    return this.appointmentsService.listAll();
  }

  @Get('my-appointments')
  @UseGuards(RolesGuard)
  @Role('DIYETISYEN')
  getMyAppointments(@Request() req) {
    return this.appointmentsService.getByDietitian(req.user.id);
  }

  @Get('my-client-appointments')
  @UseGuards(RolesGuard)
  @Role('DANISAN')
  getMyClientAppointments(@Request() req) {
    return this.appointmentsService.getByClient(req.user.id);
  }

  @Get(':id')
  show(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.getOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Role('DIYETISYEN', 'DANISAN')
  create(@Body(ValidationPipe) createDto: CreateAppointmentDto, @Request() req) {
    return this.appointmentsService.create(createDto, req.user.id, req.user.role);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Role('DIYETISYEN', 'DANISAN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateDto: UpdateAppointmentDto,
    @Request() req,
  ) {
    return this.appointmentsService.update(id, updateDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Role('DIYETISYEN', 'DANISAN', 'ADMIN')
  delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.appointmentsService.delete(id, req.user.id, req.user.role);
  }
}