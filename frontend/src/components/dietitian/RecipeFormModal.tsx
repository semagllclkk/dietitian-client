import { Button, Label, Modal, Select, Textarea, TextInput, Checkbox } from "flowbite-react";
import { useEffect, useState } from "react";
import { api } from "../../helper/api.js";
import { toast } from "sonner";
import type { Recipe } from "../../types/Recipe.js";

interface Props {
    recipe: Recipe | null;
    onClose: () => void;
    onSuccess: () => void;
}

const RecipeFormModal = ({ recipe, onClose, onSuccess }: Props) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [category, setCategory] = useState("");
    const [prepTime, setPrepTime] = useState("");
    const [cookTime, setCookTime] = useState("");
    const [servings, setServings] = useState("");
    const [calories, setCalories] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (recipe) {
            setName(recipe.name);
            setDescription(recipe.description);
            setIngredients(recipe.ingredients);
            setInstructions(recipe.instructions);
            setCategory(recipe.category || "");
            setPrepTime(recipe.prepTime?.toString() || "");
            setCookTime(recipe.cookTime?.toString() || "");
            setServings(recipe.servings?.toString() || "");
            setCalories(recipe.calories?.toString() || "");
            setIsPublic(recipe.isPublic);
        }
    }, [recipe]);

    const handleSubmit = () => {
        if (!name || !description || !ingredients || !instructions) {
            toast.error("Lütfen zorunlu alanları doldurun!");
            return;
        }

        setLoading(true);

        const data = {
            name,
            description,
            ingredients,
            instructions,
            category: category || undefined,
            prepTime: prepTime ? parseInt(prepTime) : undefined,
            cookTime: cookTime ? parseInt(cookTime) : undefined,
            servings: servings ? parseInt(servings) : undefined,
            calories: calories ? parseInt(calories) : undefined,
            isPublic,
        };

        const request = recipe
            ? api.patch(`recipes/${recipe.id}`, data)
            : api.post("recipes", data);

        request
            .then(() => {
                toast.success(recipe ? "Tarif güncellendi!" : "Tarif oluşturuldu!");
                onSuccess();
            })
            .catch((error: any) => {
                console.error("Tarif hatası:", error);
                const errorMsg = error?.response?.data?.message || "Bir hata oluştu!";
                toast.error(errorMsg);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Modal show={true} size="3xl" onClose={onClose}>
            <div className="p-6 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {recipe ? "Tarif Düzenle" : "Yeni Tarif Ekle"}
                </h2>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div>
                        <Label className="mb-2 block font-bold !text-gray-900">
                            Tarif Adı *
                        </Label>
                        <TextInput
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Örn: Izgara Tavuk Salatası"
                        />
                    </div>

                    <div>
                        <Label className="mb-2 block font-bold !text-gray-900">
                            Açıklama *
                        </Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tarif hakkında kısa bir açıklama..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="mb-2 block font-bold !text-gray-900">
                                Kategori
                            </Label>
                            <Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Seçiniz</option>
                                <option value="Kahvaltı">Kahvaltı</option>
                                <option value="Ana Yemek">Ana Yemek</option>
                                <option value="Tatlı">Tatlı</option>
                                <option value="Ara Öğün">Ara Öğün</option>
                                <option value="Çorba">Çorba</option>
                                <option value="Salata">Salata</option>
                                <option value="İçecek">İçecek</option>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                />
                                <span className="text-sm font-bold text-gray-900">Herkese Açık</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <Label className="mb-2 block font-bold !text-gray-900">
                                Hazırlık (dk)
                            </Label>
                            <TextInput
                                type="number"
                                value={prepTime}
                                onChange={(e) => setPrepTime(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block font-bold !text-gray-900">
                                Pişirme (dk)
                            </Label>
                            <TextInput
                                type="number"
                                value={cookTime}
                                onChange={(e) => setCookTime(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block font-bold !text-gray-900">
                                Porsiyon
                            </Label>
                            <TextInput
                                type="number"
                                value={servings}
                                onChange={(e) => setServings(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block font-bold !text-gray-900">
                                Kalori (kcal)
                            </Label>
                            <TextInput
                                type="number"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="mb-2 block font-bold !text-gray-900">
                            Malzemeler *
                        </Label>
                        <Textarea
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder="Her satıra bir malzeme yazın..."
                            rows={5}
                        />
                    </div>

                    <div>
                        <Label className="mb-2 block font-bold !text-gray-900">
                            Tarif Adımları *
                        </Label>
                        <Textarea
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="Tarif adımlarını yazın..."
                            rows={6}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                    <Button color="gray" onClick={onClose}>
                        İptal
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-lime-400 hover:bg-lime-500 text-gray-800"
                    >
                        {loading ? "Kaydediliyor..." : recipe ? "Güncelle" : "Oluştur"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default RecipeFormModal;
