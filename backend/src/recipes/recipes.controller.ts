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
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dtos/create-recipe.dto';
import { UpdateRecipeDto } from './dtos/update-recipe.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.decorator';

@Controller('recipes')
@UseGuards(AuthGuard('jwt'))
export class RecipesController {
    constructor(private readonly recipesService: RecipesService) { }

    @Get('public')
    listPublicRecipes() {
        return this.recipesService.listPublicRecipes();
    }

    @Get('accessible')
    @UseGuards(RolesGuard)
    @Role('DIYETISYEN')
    getAllAccessibleRecipes(@Request() req) {
        return this.recipesService.getAllAccessibleRecipes(req.user.id);
    }

    @Get('client-accessible')
    @UseGuards(RolesGuard)
    @Role('DANISAN')
    getClientAccessibleRecipes(@Request() req) {
        return this.recipesService.getForClient(req.user.id);
    }

    @Get('my-recipes')
    @UseGuards(RolesGuard)
    @Role('DIYETISYEN')
    getMyRecipes(@Request() req) {
        return this.recipesService.getByDietitian(req.user.id);
    }

    @Get(':id')
    show(@Param('id', ParseIntPipe) id: number) {
        return this.recipesService.getOne(id);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Role('DIYETISYEN')
    create(@Body(ValidationPipe) createDto: CreateRecipeDto, @Request() req) {
        console.log('===============================');
        console.log('RECIPES.CONTROLLER.create called');
        console.log('User from req.user:', req.user);
        console.log('User ID:', req.user.id, 'Type:', typeof req.user.id);
        console.log('User role:', req.user.role, 'Type:', typeof req.user.role);
        console.log('Recipe DTO:', createDto);
        console.log('===============================');
        return this.recipesService.create(createDto, req.user.id);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Role('DIYETISYEN')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe) updateDto: UpdateRecipeDto,
        @Request() req,
    ) {
        return this.recipesService.update(id, updateDto, req.user.id, req.user.role);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Role('DIYETISYEN', 'ADMIN')
    delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.recipesService.delete(id, req.user.id, req.user.role);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Role('ADMIN')
    listAllRecipes() {
        return this.recipesService.listAllRecipes();
    }
}
