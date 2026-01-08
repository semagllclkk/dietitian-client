import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { DietPlan } from '../diet-plans/diet-plan.entity';
import { CreateRecipeDto } from './dtos/create-recipe.dto';
import { UpdateRecipeDto } from './dtos/update-recipe.dto';

@Injectable()
export class RecipesService {
    constructor(
        @InjectRepository(Recipe)
        private recipesRepository: Repository<Recipe>,
        @InjectRepository(DietPlan)
        private dietPlansRepository: Repository<DietPlan>,
    ) { }

    async listPublicRecipes() {
        return this.recipesRepository.find({
            where: { isPublic: true },
            relations: ['dietitian'],
            order: { createdAt: 'DESC' },
        });
    }

    async getByDietitian(dietitianId: number) {
        return this.recipesRepository.find({
            where: { dietitianId },
            order: { createdAt: 'DESC' },
        });
    }

    async getAllAccessibleRecipes(dietitianId: number) {
        return this.recipesRepository
            .createQueryBuilder('recipe')
            .leftJoinAndSelect('recipe.dietitian', 'dietitian')
            .where('recipe.isPublic = :isPublic', { isPublic: true })
            .orWhere('recipe.dietitianId = :dietitianId', { dietitianId })
            .orderBy('recipe.createdAt', 'DESC')
            .getMany();
    }

    async getForClient(clientId: number) {
        const lastPlan = await this.dietPlansRepository.findOne({
            where: { clientId },
            order: { createdAt: 'DESC' },
            relations: ['dietitian']
        });

        const dietitianId = lastPlan?.dietitianId;

        const query = this.recipesRepository
            .createQueryBuilder('recipe')
            .leftJoinAndSelect('recipe.dietitian', 'dietitian')
            .where('recipe.isPublic = :isPublic', { isPublic: true });

        if (dietitianId) {
            query.orWhere('recipe.dietitianId = :dietitianId', { dietitianId });
        }

        return query.orderBy('recipe.createdAt', 'DESC').getMany();
    }

    async getOne(id: number) {
        const recipe = await this.recipesRepository.findOne({
            where: { id },
            relations: ['dietitian'],
        });
        if (!recipe) throw new NotFoundException('Recipe not found');
        return recipe;
    }

    async create(createDto: CreateRecipeDto, dietitianId: number) {
        try {
            console.log('RECIPES.create called with:', { createDto, dietitianId });
            const recipe = this.recipesRepository.create({
                ...createDto,
                dietitianId,
            });
            console.log('RECIPES.recipe object before save:', recipe);
            const saved = await this.recipesRepository.save(recipe);
            console.log('RECIPES.recipe saved successfully:', saved);
            return saved;
        } catch (error) {
            console.error('RECIPES.create error:', error.message);
            console.error('RECIPES.create error details:', error);
            throw error;
        }
    }

    async update(id: number, updateDto: UpdateRecipeDto, userId: number, userRole: string) {
        const recipe = await this.getOne(id);

        if (userRole === 'DIYETISYEN' && recipe.dietitianId !== userId) {
            throw new ForbiddenException('You can only update your own recipes');
        }

        Object.assign(recipe, updateDto);
        return this.recipesRepository.save(recipe);
    }

    async delete(id: number, userId: number, userRole: string) {
        const recipe = await this.getOne(id);

        if (userRole === 'DIYETISYEN' && recipe.dietitianId !== userId) {
            throw new ForbiddenException('You can only delete your own recipes');
        }

        return this.recipesRepository.delete(id);
    }

    async listAllRecipes() {
        return this.recipesRepository.find({
            relations: ['dietitian'],
            order: { createdAt: 'DESC' },
        });
    }
}
