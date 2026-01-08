export interface Recipe {
    id: number;
    name: string;
    description: string;
    ingredients: string;
    instructions: string;
    category?: string;
    prepTime?: number;
    cookTime?: number;
    servings?: number;
    calories?: number;
    isPublic: boolean;
    createdAt: string;
    dietitianId: number;
    dietitian?: {
        id: number;
        fullName: string;
    };
}
