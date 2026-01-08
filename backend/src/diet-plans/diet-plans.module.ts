import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DietPlansController } from './diet-plans.controller';
import { DietPlansService } from './diet-plans.service';
import { DietPlan } from './diet-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DietPlan])],
  controllers: [DietPlansController],
  providers: [DietPlansService],
})
export class DietPlansModule {}