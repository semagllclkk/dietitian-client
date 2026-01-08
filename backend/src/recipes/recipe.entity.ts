import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'recipe' })
export class Recipe {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column('text')
    ingredients: string;

    @Column('text')
    instructions: string;

    @Column({ nullable: true })
    category: string;

    @Column({ nullable: true })
    prepTime: number;

    @Column({ nullable: true })
    cookTime: number; 

    @Column({ nullable: true })
    servings: number; 

    @Column({ nullable: true })
    calories: number;

    @Column({ default: false })
    isPublic: boolean; 

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne('User', { nullable: false })
    dietitian: any;

    @Column()
    dietitianId: number;

    @ManyToMany('DietPlan', 'recipes')
    dietPlans: any[];
}
