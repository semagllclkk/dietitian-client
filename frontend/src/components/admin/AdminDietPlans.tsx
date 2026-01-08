import { useEffect, useState } from "react";
import { api } from "../../helper/api";

interface DietPlan {
  id: number;
  name?: string;
  title?: string;
  description?: string;
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snacks?: string;
  dietitian?: { fullName: string };
  client?: { fullName: string };
}

const AdminDietPlans = () => {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDietPlans();
  }, []);

  const fetchDietPlans = async () => {
    try {
      const res = await api.request({
        url: "diet-plans",
        method: "get",
      });
      setDietPlans(res.data);
    } catch (error) {
      console.error("Diyet planlarını yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tüm Diyet Planları</h2>
      {dietPlans.length === 0 ? (
        <p className="text-gray-600">Henüz diyet planı oluşturulmamış.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dietPlans.map((plan) => (
            <div key={plan.id} className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition">
              <div className="mb-4">
                <h3 className="font-bold text-lg text-gray-800">{plan.title || plan.name}</h3>
                <p className="text-xs text-gray-500 mt-2">
                  Diyetisyen: <span className="font-semibold">{plan.dietitian?.fullName || "Belirtilmemiş"}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Danışan: <span className="font-semibold">{plan.client?.fullName || "Belirtilmemiş"}</span>
                </p>
              </div>

              {plan.description && (
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <p className="text-sm text-gray-700"><strong>Açıklama:</strong></p>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>
              )}

              <div className="space-y-2 text-sm">
                {plan.breakfast && (
                  <div>
                    <p className="font-semibold text-gray-700">Kahvaltı:</p>
                    <p className="text-gray-600">{plan.breakfast}</p>
                  </div>
                )}
                {plan.lunch && (
                  <div>
                    <p className="font-semibold text-gray-700">Öğle Yemeği:</p>
                    <p className="text-gray-600">{plan.lunch}</p>
                  </div>
                )}
                {plan.dinner && (
                  <div>
                    <p className="font-semibold text-gray-700">Akşam Yemeği:</p>
                    <p className="text-gray-600">{plan.dinner}</p>
                  </div>
                )}
                {plan.snacks && (
                  <div>
                    <p className="font-semibold text-gray-700">Ara Öğünler:</p>
                    <p className="text-gray-600">{plan.snacks}</p>
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

export default AdminDietPlans;
