import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DietPlan } from './diet-plan.entity';
import { CreateDietPlanDto } from './dtos/create-diet-plan.dto';
import { UpdateDietPlanDto } from './dtos/update-diet-plan.dto';

@Injectable()
export class DietPlansService {
  constructor(
    @InjectRepository(DietPlan)
    private dietPlansRepository: Repository<DietPlan>,
  ) {}

  async listAll() {
    return this.dietPlansRepository.find({
      relations: ['dietitian', 'client'],
      order: { id: 'DESC' },
    });
  }

  async getByDietitian(dietitianId: number) {
    return this.dietPlansRepository.find({
      where: { dietitianId },
      relations: ['client'],
      order: { createdAt: 'DESC' },
    });
  }

  async getByClient(clientId: number) {
    return this.dietPlansRepository.find({
      where: { clientId },
      relations: ['dietitian'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOne(id: number) {
    const plan = await this.dietPlansRepository.findOne({
      where: { id },
      relations: ['dietitian', 'client'],
    });
    if (!plan) throw new NotFoundException('Diet plan not found');
    return plan;
  }

  async create(createDto: CreateDietPlanDto, dietitianId: number) {
    try {
      console.log('DIET_PLANS.create called with:', { createDto, dietitianId });
      const plan = this.dietPlansRepository.create({
        ...createDto,
        dietitianId,
      });
      console.log('DIET_PLANS.plan object before save:', plan);
      const saved = await this.dietPlansRepository.save(plan);
      console.log('DIET_PLANS.plan saved successfully:', saved);
      return saved;
    } catch (error) {
      console.error('DIET_PLANS.create error:', error.message);
      console.error('DIET_PLANS.create error details:', error);
      throw error;
    }
  }

  async update(id: number, updateDto: UpdateDietPlanDto, userId: number, userRole: string) {
    const plan = await this.getOne(id);
    
    if (userRole === 'DIYETISYEN' && plan.dietitianId !== userId) {
      throw new ForbiddenException('You can only update your own diet plans');
    }

    Object.assign(plan, updateDto);
    return this.dietPlansRepository.save(plan);
  }

  async delete(id: number, userId: number, userRole: string) {
    const plan = await this.getOne(id);
    
    if (userRole === 'DIYETISYEN' && plan.dietitianId !== userId) {
      throw new ForbiddenException('You can only delete your own diet plans');
    }

    return this.dietPlansRepository.delete(id);
  }
}