export interface Recipe {
    id: number;
    name: string;
    description: string | null;
    steps: string;
    imageUrl: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface RecipeRepository {
    findAll(): Promise<Recipe[]>;
    findById(id: number): Promise<Recipe | null>;
    create(recipe: Partial<Recipe>): Promise<Recipe>;
    update(id: number, recipe: Partial<Recipe>): Promise<Recipe>;
    delete(id: number): Promise<void>;
}