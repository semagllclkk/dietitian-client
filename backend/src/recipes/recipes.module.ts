import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { Recipe } from './recipe.entity';
import { DietPlan } from '../diet-plans/diet-plan.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Recipe, DietPlan])],
    controllers: [RecipesController],
    providers: [RecipesService],
})
export class RecipesModule { }
