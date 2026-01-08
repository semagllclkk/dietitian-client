import { Column, Entity, ManyToOne, ManyToMany, JoinTable, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'diet_plan' })
export class DietPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  breakfast: string;

  @Column('text')
  lunch: string;

  @Column('text')
  dinner: string;

  @Column('text')
  snacks: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column({ default: 'ACTIVE' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('date')
  startDate: Date;

  @Column('date')
  endDate: Date;

  @ManyToOne('User', 'createdDietPlans')
  dietitian: any;

  @Column()
  dietitianId: number;

  @ManyToOne('User', 'assignedDietPlans')
  client: any;

  @Column()
  clientId: number;

  @ManyToMany('Recipe', 'dietPlans', { nullable: true })
  @JoinTable({
    name: 'diet_plan_recipes',
    joinColumn: { name: 'dietPlanId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'recipeId', referencedColumnName: 'id' },
  })
  recipes: any[];
}