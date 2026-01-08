import { IsString, IsNumber, IsBoolean, IsOptional, IsIn } from 'class-validator';

export class UpdateRecipeDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    ingredients?: string;

    @IsOptional()
    @IsString()
    instructions?: string;

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
