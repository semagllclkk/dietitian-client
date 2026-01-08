import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateDietPlanDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  breakfast: string;

  @IsString()
  lunch: string;

  @IsString()
  dinner: string;

  @IsString()
  snacks: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsNumber()
  @Min(1, { message: 'Lütfen bir danışan seçin' })
  clientId: number;

  @IsOptional()
  @IsString()
  status?: string;
}