import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import type { DietPlan } from "../../types/DietPlan";

interface Props {
  plan: DietPlan;
  onClose: () => void;
}

const DietPlanViewModal = ({ plan, onClose }: Props) => {
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
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status] || "bg-gray-400 text-black"}`}>
        {labels[status] || status}
      </span>
    );
  }

  return (
    <Modal show={true} size="3xl" onClose={onClose}>
      <ModalHeader className="bg-gradient-to-br from-lime-200 to-lime-100">
        <span className="text-black font-semibold">Diyet Planı Detayları</span>
      </ModalHeader>
      <ModalBody className="bg-gradient-to-br from-lime-100 to-white">
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{plan.title}</h2>
              <p className="text-gray-600 mt-1">{plan.description}</p>
            </div>
            {getStatusBadge(plan.status)}
          </div>

          <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg border-2 border-lime-200">
            <div>
              <p className="text-sm text-gray-600">Danışan</p>
              <p className="font-semibold text-gray-800">{plan.client?.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Kullanıcı Adı</p>
              <p className="font-semibold text-gray-800">{plan.client?.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Başlangıç Tarihi</p>
              <p className="font-semibold text-gray-800">
                {new Date(plan.startDate).toLocaleDateString("tr-TR")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bitiş Tarihi</p>
              <p className="font-semibold text-gray-800">
                {new Date(plan.endDate).toLocaleDateString("tr-TR")}
              </p>
            </div>
          </div>

          <div className="bg-lime-50 p-4 rounded-lg border-2 border-lime-200">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">📋 Öğün Planı</h3>

            <div className="space-y-4">
              <div className="bg-white p-3 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">🌅 Kahvaltı</h4>
                <p className="text-gray-600 whitespace-pre-line">{plan.breakfast}</p>
              </div>

              <div className="bg-white p-3 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">☀️ Öğle Yemeği</h4>
                <p className="text-gray-600 whitespace-pre-line">{plan.lunch}</p>
              </div>

              <div className="bg-white p-3 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">🌙 Akşam Yemeği</h4>
                <p className="text-gray-600 whitespace-pre-line">{plan.dinner}</p>
              </div>

              <div className="bg-white p-3 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">🍎 Ara Öğünler</h4>
                <p className="text-gray-600 whitespace-pre-line">{plan.snacks}</p>
              </div>
            </div>
          </div>

          {plan.notes && (
            <div className="bg-pink-50 p-4 rounded-lg border-2 border-pink-200">
              <h3 className="font-bold text-gray-800 mb-2">📝 Ek Notlar</h3>
              <p className="text-gray-600 whitespace-pre-line">{plan.notes}</p>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t-2 border-lime-200">
            <Button onClick={onClose} className="bg-lime-400 hover:bg-lime-500 text-gray-800">
              Kapat
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DietPlanViewModal;