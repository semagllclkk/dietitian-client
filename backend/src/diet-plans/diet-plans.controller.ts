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
import { DietPlansService } from './diet-plans.service';
import { CreateDietPlanDto } from './dtos/create-diet-plan.dto';
import { UpdateDietPlanDto } from './dtos/update-diet-plan.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.decorator';

@Controller('diet-plans')
@UseGuards(AuthGuard('jwt'))
export class DietPlansController {
  constructor(private readonly dietPlansService: DietPlansService) { }

  @Get()
  @UseGuards(RolesGuard)
  @Role('ADMIN')
  listAll() {
    return this.dietPlansService.listAll();
  }

  @Get('my-plans')
  @UseGuards(RolesGuard)
  @Role('DIYETISYEN')
  getMyPlans(@Request() req) {
    return this.dietPlansService.getByDietitian(req.user.id);
  }

  @Get('my-assigned-plans')
  @UseGuards(RolesGuard)
  @Role('DANISAN')
  getMyAssignedPlans(@Request() req) {
    console.log(`Fetching assigned plans for client: ${req.user.id} - ${req.user.username}`);
    return this.dietPlansService.getByClient(req.user.id);
  }

  @Get(':id')
  show(@Param('id', ParseIntPipe) id: number) {
    return this.dietPlansService.getOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Role('DIYETISYEN')
  create(@Body(ValidationPipe) createDto: CreateDietPlanDto, @Request() req) {
    console.log('===============================');
    console.log('DIET-PLANS.CONTROLLER.create called');
    console.log('User from req.user:', req.user);
    console.log('User ID:', req.user.id, 'Type:', typeof req.user.id);
    console.log('User role:', req.user.role, 'Type:', typeof req.user.role);
    console.log('Diet Plan DTO:', createDto);
    console.log('===============================');
    return this.dietPlansService.create(createDto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Role('DIYETISYEN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateDto: UpdateDietPlanDto,
    @Request() req,
  ) {
    return this.dietPlansService.update(id, updateDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Role('DIYETISYEN', 'ADMIN')
  delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.dietPlansService.delete(id, req.user.id, req.user.role);
  }
}