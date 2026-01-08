import { useEffect, useState } from "react";
import { api } from "../../helper/api.js";
import { Button, Card } from "flowbite-react";
import { toast } from "sonner";
import type { Recipe } from "../../types/Recipe.js";
import RecipeFormModal from "./RecipeFormModal.js";
import { FaPlus, FaEdit, FaTrash, FaUtensils } from "react-icons/fa";

const DietitianRecipes = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        loadRecipes();
    }, []);

    const loadRecipes = () => {
        setLoading(true);
        api
            .get("recipes/my-recipes")
            .then((res) => {
                setRecipes(res.data);
            })
            .catch(() => {
                toast.error("Tarifler yüklenirken hata oluştu!");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDelete = (id: number) => {
        if (!confirm("Bu tarifi silmek istediğinizden emin misiniz?")) return;

        api
            .delete(`recipes/${id}`)
            .then(() => {
                toast.success("Tarif silindi!");
                loadRecipes();
            })
            .catch(() => {
                toast.error("Tarif silinirken hata oluştu!");
            });
    };

    const getCategoryBadge = (category?: string) => {
        const colors: Record<string, string> = {
            "Kahvaltı": "bg-yellow-100 text-yellow-800",
            "Ana Yemek": "bg-red-100 text-red-800",
            "Tatlı": "bg-pink-100 text-pink-800",
            "Ara Öğün": "bg-green-100 text-green-800",
            "Çorba": "bg-orange-100 text-orange-800",
            "Salata": "bg-lime-100 text-lime-800",
            "İçecek": "bg-blue-100 text-blue-800",
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[category || ""] || "bg-gray-100 text-gray-800"}`}>
                {category || "Diğer"}
            </span>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <FaUtensils className="text-lime-500" />
                    Tariflerim
                </h1>
                <Button
                    onClick={() => {
                        setSelectedRecipe(null);
                        setShowFormModal(true);
                    }}
                    className="bg-lime-400 hover:bg-lime-500 text-gray-800 font-semibold"
                >
                    <FaPlus className="mr-2" />
                    Yeni Tarif Ekle
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Tarifler yükleniyor...</p>
                </div>
            ) : recipes.length === 0 ? (
                <Card className="text-center py-8">
                    <FaUtensils className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Henüz tarif eklememişsiniz.</p>
                    <Button
                        onClick={() => setShowFormModal(true)}
                        className="bg-lime-400 hover:bg-lime-500 text-gray-800"
                    >
                        İlk Tarifini Ekle
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                        <Card key={recipe.id} className="hover:shadow-xl transition-shadow bg-pink-800 border-2 border-pink-700">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-bold text-white">{recipe.name}</h3>
                                {getCategoryBadge(recipe.category)}
                            </div>

                            <p className="text-gray-100 text-sm mb-4 line-clamp-2">{recipe.description}</p>

                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-200 mb-4">
                                {recipe.prepTime && (
                                    <div>⏱️ Hazırlık: {recipe.prepTime} dk</div>
                                )}
                                {recipe.cookTime && (
                                    <div>🔥 Pişirme: {recipe.cookTime} dk</div>
                                )}
                                {recipe.servings && (
                                    <div>🍽️ Porsiyon: {recipe.servings}</div>
                                )}
                                {recipe.calories && (
                                    <div>⚡ Kalori: {recipe.calories} kcal</div>
                                )}
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                                <span className={`text-xs font-semibold ${recipe.isPublic ? "text-green-700" : "text-gray-400"}`}>
                                    {recipe.isPublic ? "🌍 Herkese Açık" : "🔒 Özel"}
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        size="xs"
                                        onClick={() => {
                                            setSelectedRecipe(recipe);
                                            setShowFormModal(true);
                                        }}
                                        className="bg-yellow-500 hover:bg-yellow-600"
                                    >
                                        <FaEdit className="mr-1" />
                                        Düzenle
                                    </Button>
                                    <Button
                                        size="xs"
                                        color="failure"
                                        onClick={() => handleDelete(recipe.id)}
                                    >
                                        <FaTrash className="mr-1" />
                                        
                                        Sil
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {showFormModal && (
                <RecipeFormModal
                    recipe={selectedRecipe}
                    onClose={() => {
                        setShowFormModal(false);
                        setSelectedRecipe(null);
                    }}
                    onSuccess={() => {
                        loadRecipes();
                        setShowFormModal(false);
                        setSelectedRecipe(null);
                    }}
                />
            )}
        </div>
    );
};

export default DietitianRecipes;
