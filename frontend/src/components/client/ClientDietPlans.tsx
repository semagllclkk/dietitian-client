import { useEffect, useState } from "react";
import { api } from "../../helper/api";
import type { DietPlan } from "../../types/DietPlan";
import { Button, Card } from "flowbite-react";
import { FaEye } from "react-icons/fa";
import DietPlanViewModal from "../dietitian/DietPlanViewModal";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext";
import { toast } from "sonner";

const ClientDietPlans = () => {
  const { loggedInUser } = useLoggedInUsersContext();
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);
  const [showView, setShowView] = useState(false);

  useEffect(() => {
    if (loggedInUser?.role === "DANISAN") {
      fetchDietPlans();
    }
  }, [loggedInUser]);

  function fetchDietPlans() {
    api.get("diet-plans/my-assigned-plans")
      .then((res) => {
        setDietPlans(res.data);
      })
      .catch((error) => {
        console.error("Diyet planı listesi yükleme hatası:", error);
        toast.error("Diyet planı listesi yüklenemedi");
      });
  }

  function handleView(plan: DietPlan) {
    setSelectedPlan(plan);
    setShowView(true);
  }

  function getStatusBadge(status: string) {
    const badges: Record<string, string> = {
      ACTIVE: "bg-lime-400 text-gray-200",
      COMPLETED: "bg-green-400 text-white",
      CANCELLED: "bg-red-400 text-white",
    };
    const labels: Record<string, string> = {
      ACTIVE: "Aktif",
      COMPLETED: "Tamamlandı",
      CANCELLED: "İptal Edildi",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status] || "bg-gray-400 text-white"}`}>
        {labels[status] || status}
      </span>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Diyet Planlarım</h1>

      <div className="grid grid-cols-1 gap-6">
        {dietPlans.map((plan) => (
          <Card key={plan.id} className="bg-white border-2 border-lime-300 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-500">{plan.title}</h2>
                  {getStatusBadge(plan.status)}
                </div>
                <p className="text-gray-300 mb-4">{plan.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Diyetisyen</p>
                    <p className="font-semibold text-gray-500">{plan.dietitian?.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Başlangıç Tarihi</p>
                    <p className="font-semibold text-gray-200">
                      {new Date(plan.startDate).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Bitiş Tarihi</p>
                    <p className="font-semibold text-gray-200">
                      {new Date(plan.endDate).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Oluşturulma</p>
                    <p className="font-semibold text-gray-200">
                      {new Date(plan.createdAt).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleView(plan)}
                className="bg-lime-400 hover:bg-lime-500 text-gray-200 ml-4"
              >
                <FaEye className="mr-2" /> Detayları Gör
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t-2 border-lime-100">
              <p className="text-sm text-gray-400 mb-2 font-semibold">Günlük Öğün Özeti:</p>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="bg-lime-50 p-2 rounded">
                  <p className="font-semibold text-gray-700">🌅 Kahvaltı</p>
                  <p className="text-gray-600 truncate">{plan.breakfast}</p>
                </div>
                <div className="bg-lime-50 p-2 rounded">
                  <p className="font-semibold text-gray-700">☀️ Öğle</p>
                  <p className="text-gray-600 truncate">{plan.lunch}</p>
                </div>
                <div className="bg-lime-50 p-2 rounded">
                  <p className="font-semibold text-gray-700">🌙 Akşam</p>
                  <p className="text-gray-600 truncate">{plan.dinner}</p>
                </div>
                <div className="bg-lime-50 p-2 rounded">
                  <p className="font-semibold text-gray-700">🍎 Ara Öğün</p>
                  <p className="text-gray-600 truncate">{plan.snacks}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {dietPlans.length === 0 && (
        <Card className="bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300">
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">
              Henüz size atanmış bir diyet planı bulunmamaktadır.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Diyetisyeniniz yakında size özel bir plan hazırlayacaktır.
            </p>
          </div>
        </Card>
      )}

      {showView && selectedPlan && (
        <DietPlanViewModal
          plan={selectedPlan}
          onClose={() => {
            setShowView(false);
            setSelectedPlan(null);
          }}
        />
      )}
    </div>
  );
};

export default ClientDietPlans;