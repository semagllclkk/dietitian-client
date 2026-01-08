import { useEffect, useState } from "react";
import { api } from "../../helper/api.ts";
import type { DietPlan } from "../../types/DietPlan";
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { toast } from "sonner";
import DietPlanFormModal from "./DietitianFormModal";
import DietPlanViewModal from "./DietPlanViewModal.tsx";
import DeleteConfirmModal from "../shared/DeleteConfirmModal.tsx";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext.js";

const DietitianDietPlans = () => {
  const { loggedInUser } = useLoggedInUsersContext();
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<DietPlan | null>(null);

  useEffect(() => {
    if (loggedInUser?.role === "DIYETISYEN") {
      fetchDietPlans();
    }
  }, [loggedInUser]);

  function fetchDietPlans() {
    api.get("diet-plans/my-plans")
      .then((res) => {
        setDietPlans(res.data);
      })
      .catch((error) => {
        console.error("Diyet planı listesi yükleme hatası:", error);
        toast.error("Diyet planı listesi yüklenemedi");
      });
  }

  function handleEdit(plan: DietPlan) {
    setSelectedPlan(plan);
    setShowForm(true);
  }

  function handleView(plan: DietPlan) {
    setSelectedPlan(plan);
    setShowView(true);
  }

  function handleDeleteClick(plan: DietPlan) {
    setPlanToDelete(plan);
    setShowDelete(true);
  }

  function handleDelete() {
    if (!planToDelete) return;

    api.delete(`diet-plans/${planToDelete.id}`)
      .then(() => {
        toast.success("Diyet planı silindi");
        fetchDietPlans();
        setShowDelete(false);
        setPlanToDelete(null);
      })
      .catch(() => {
        toast.error("Silme işlemi başarısız");
      });
  }

  function getStatusBadge(status: string) {
    const badges: Record<string, string> = {
      ACTIVE: "bg-lime-400 text-gray-800",
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Diyet Planlarım</h1>
        <Button
          onClick={() => {
            setSelectedPlan(null);
            setShowForm(true);
          }}
          className="bg-lime-400 hover:bg-lime-500 text-gray-800"
        >
          <FaPlus className="mr-2" /> Yeni Plan Oluştur
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-lg border-2 border-lime-300 overflow-hidden">
        <Table>
          <TableHead className="bg-pink-600">
            <TableRow>
              <TableHeadCell className="!text-white">ID</TableHeadCell>
              <TableHeadCell className="!text-white">Başlık</TableHeadCell>
              <TableHeadCell className="!text-white">Danışan</TableHeadCell>
              <TableHeadCell className="!text-white">Başlangıç</TableHeadCell>
              <TableHeadCell className="!text-white">Bitiş</TableHeadCell>
              <TableHeadCell className="!text-white">Durum</TableHeadCell>
              <TableHeadCell className="!text-white">İşlemler</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dietPlans.map((plan) => (
              <TableRow key={plan.id} className="hover:bg-lime-50">
                <TableCell>{plan.id}</TableCell>
                <TableCell className="font-semibold">{plan.title}</TableCell>
                <TableCell>{plan.client?.fullName || "Belirtilmemiş"}</TableCell>
                <TableCell>{new Date(plan.startDate).toLocaleDateString("tr-TR")}</TableCell>
                <TableCell>{new Date(plan.endDate).toLocaleDateString("tr-TR")}</TableCell>
                <TableCell>{getStatusBadge(plan.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="xs" color="blue" onClick={() => handleView(plan)}>
                      <FaEye />
                    </Button>
                    <Button size="xs" color="green" onClick={() => handleEdit(plan)}>
                      <FaEdit />
                    </Button>
                    <Button size="xs" color="red" onClick={() => handleDeleteClick(plan)}>
                      <FaTrash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {dietPlans.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Henüz diyet planı oluşturmadınız. "Yeni Plan Oluştur" butonuna tıklayarak başlayabilirsiniz.
          </div>
        )}
      </div>

      {showForm && (
        <DietPlanFormModal
          plan={selectedPlan}
          onClose={() => {
            setShowForm(false);
            setSelectedPlan(null);
          }}
          onSuccess={() => {
            fetchDietPlans();
            setShowForm(false);
            setSelectedPlan(null);
          }}
        />
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

      {showDelete && (
        <DeleteConfirmModal
          title="Diyet Planını Sil"
          message="Bu diyet planını silmek istediğinizden emin misiniz?"
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDelete(false);
            setPlanToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default DietitianDietPlans;