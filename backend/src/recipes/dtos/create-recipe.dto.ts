import { IsString, IsNumber, IsBoolean, IsOptional, IsIn } from 'class-validator';

export class CreateRecipeDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    ingredients: string;

    @IsString()
    instructions: string;

    @IsOptional()
    @IsIn(['Kahvaltı', 'Ana Yemek', 'Tatlı', 'Ara Öğün', 'Çorba', 'Salata', 'İçecek'])
    category?: string;

    @IsOptional()
    @IsNumber()
    prepTime?: number;

    @IsOptional()
    @IsNumber()
    cookTime?: number;

    @IsOptional()
    @IsNumber()
    servings?: number;

    @IsOptional()
    @IsNumber()
    calories?: number;

    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;
}
