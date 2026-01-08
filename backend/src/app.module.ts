import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { DietPlansModule } from './diet-plans/diet-plans.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { DietPlan } from './diet-plans/diet-plan.entity';
import { Appointment } from './appointments/appointment.entity';
import { Recipe } from './recipes/recipe.entity';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'diet_system_db',
      entities: [User, DietPlan, Appointment, Recipe],
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
      logging: true,
    }),
    AuthModule,
    DietPlansModule,
    AppointmentsModule,
    RecipesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }