import { useEffect, useState } from "react";
import { api } from "../../helper/api.js";
import { Card } from "flowbite-react";
import { toast } from "sonner";
import type { Recipe } from "../../types/Recipe.js";
import { FaUtensils, FaClock, FaFire, FaUsers } from "react-icons/fa";

const ClientRecipes = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecipes();
    }, []);

    const loadRecipes = () => {
        setLoading(true);
        api
            .get("recipes/client-accessible")
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
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaUtensils className="text-pink-400" />
                Önerilen Tarifler
            </h1>

            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Tarifler yükleniyor...</p>
                </div>
            ) : recipes.length === 0 ? (
                <Card className="text-center py-8">
                    <FaUtensils className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Henüz paylaşılan tarif bulunmamaktadır.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                        <Card key={recipe.id} className="hover:shadow-xl transition-shadow border-2 border-pink-200 bg-pink-50">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-bold text-pink-200">{recipe.name}</h3>
                                {getCategoryBadge(recipe.category)}
                            </div>

                            <p className="text-gray-300 text-sm mb-4 line-clamp-3">{recipe.description}</p>

                            <div className="space-y-2 mb-4">
                                {recipe.prepTime && (
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <FaClock className="text-pink-500" />
                                        <span>Hazırlık: {recipe.prepTime} dk</span>
                                    </div>
                                )}
                                {recipe.cookTime && (
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <FaFire className="text-pink-500" />
                                        <span>Pişirme: {recipe.cookTime} dk</span>
                                    </div>
                                )}
                                {recipe.servings && (
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <FaUsers className="text-pink-500" />
                                        <span>{recipe.servings} Porsiyon</span>
                                    </div>
                                )}
                                {recipe.calories && (
                                    <div className="text-sm font-semibold text-pink-700">
                                        ⚡ {recipe.calories} kcal
                                    </div>
                                )}
                            </div>

                            {recipe.dietitian && (
                                <div className="pt-3 border-t border-pink-200 text-xs text-gray-300 font-semibold">
                                    👨‍⚕️ Diyetisyen: {recipe.dietitian.fullName}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClientRecipes;
