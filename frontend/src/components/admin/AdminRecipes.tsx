import { useEffect, useState } from "react";
import { api } from "../../helper/api";

interface Recipe {
  id: number;
  name: string;
  description?: string;
  ingredients?: string;
  instructions?: string;
  category?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  calories?: number;
  dietitian?: { fullName: string };
}

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await api.request({
        url: "recipes",
        method: "get",
      });
      setRecipes(res.data);
    } catch (error) {
      console.error("Tarifleri yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tüm Tarifler</h2>
      {recipes.length === 0 ? (
        <p className="text-gray-600">Henüz tarif oluşturulmamış.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition">
              <div className="mb-3">
                <h3 className="font-bold text-lg text-gray-800">{recipe.name}</h3>
                <p className="text-xs text-gray-500 mt-2">
                  Diyetisyen: <span className="font-semibold">{recipe.dietitian?.fullName || "Belirtilmemiş"}</span>
                </p>
              </div>

              {recipe.description && (
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <p className="text-sm text-gray-700"><strong>Açıklama:</strong></p>
                  <p className="text-sm text-gray-600">{recipe.description}</p>
                </div>
              )}

              <div className="space-y-2 text-sm">
                {recipe.category && (
                  <div>
                    <p className="text-gray-600"><strong>Kategori:</strong> {recipe.category}</p>
                  </div>
                )}
                {recipe.prepTime && (
                  <div>
                    <p className="text-gray-600"><strong>Hazırlık Süresi:</strong> {recipe.prepTime} dk</p>
                  </div>
                )}
                {recipe.cookTime && (
                  <div>
                    <p className="text-gray-600"><strong>Pişirme Süresi:</strong> {recipe.cookTime} dk</p>
                  </div>
                )}
                {recipe.servings && (
                  <div>
                    <p className="text-gray-600"><strong>Porsiyon:</strong> {recipe.servings}</p>
                  </div>
                )}
                {recipe.calories && (
                  <div>
                    <p className="text-gray-600"><strong>Kalori:</strong> {recipe.calories} kcal</p>
                  </div>
                )}
                {recipe.ingredients && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-gray-700 font-semibold">Malzemeler:</p>
                    <p className="text-gray-600 text-xs">{recipe.ingredients}</p>
                  </div>
                )}
                {recipe.instructions && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-gray-700 font-semibold">Hazırlama:</p>
                    <p className="text-gray-600 text-xs">{recipe.instructions}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRecipes;
