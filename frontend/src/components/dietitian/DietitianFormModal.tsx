import { Button, Label, Modal, ModalBody, ModalHeader, Select, TextInput, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { api } from "../../helper/api.ts";
import { toast } from "sonner";
import { showErrors } from "../../helper/helper.ts";
import type { DietPlan } from "../../types/DietPlan.ts";
import type { Client } from "../../types/Client.ts";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext.js";

interface Props {
  plan: DietPlan | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DietPlanFormModal = ({ plan, onClose, onSuccess }: Props) => {
  const { loggedInUser } = useLoggedInUsersContext();
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    title: plan?.title || "",
    description: plan?.description || "",
    breakfast: plan?.breakfast || "",
    lunch: plan?.lunch || "",
    dinner: plan?.dinner || "",
    snacks: plan?.snacks || "",
    notes: plan?.notes || "",
    startDate: plan?.startDate?.split("T")[0] || "",
    endDate: plan?.endDate?.split("T")[0] || "",
    clientId: plan?.clientId || 0,
    status: plan?.status || "ACTIVE",
  });

  useEffect(() => {
    if (loggedInUser?.role === "DIYETISYEN") {
      api.get("auth/clients")
        .then((res) => {
          setClients(res.data);
        })
        .catch((error) => {
          console.error("Danışan listesi yükleme hatası:", error);
          toast.error("Danışan listesi yüklenemedi");
        });
    }
  }, [loggedInUser]);

  function handleSubmit() {
    if (!formData.clientId || formData.clientId === 0) {
      toast.error("Lütfen bir danışan seçin");
      return;
    }

    if (!formData.title) {
      toast.error("Lütfen plan başlığını girin");
      return;
    }

    if (!formData.description) {
      toast.error("Lütfen açıklama girin");
      return;
    }

    if (!formData.breakfast) {
      toast.error("Lütfen kahvaltı bilgisini girin");
      return;
    }

    if (!formData.lunch) {
      toast.error("Lütfen öğle yemeği bilgisini girin");
      return;
    }

    if (!formData.dinner) {
      toast.error("Lütfen akşam yemeği bilgisini girin");
      return;
    }

    if (!formData.snacks) {
      toast.error("Lütfen ara öğünler bilgisini girin");
      return;
    }

    if (!formData.startDate) {
      toast.error("Lütfen başlangıç tarihi seçin");
      return;
    }

    if (!formData.endDate) {
      toast.error("Lütfen bitiş tarihi seçin");
      return;
    }

    const payload = plan ? formData : {
      title: formData.title,
      description: formData.description,
      breakfast: formData.breakfast,
      lunch: formData.lunch,
      dinner: formData.dinner,
      snacks: formData.snacks,
      notes: formData.notes,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : "",
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : "",
      clientId: formData.clientId,
    };

    if (plan) {
      api.patch(`diet-plans/${plan.id}`, payload)
        .then(() => {
          toast.success("Diyet planı güncellendi");
          onSuccess();
        })
        .catch((error) => showErrors(error));
    } else {
      api.post("diet-plans", payload)
        .then(() => {
          toast.success("Diyet planı oluşturuldu");
          onSuccess();
        })
        .catch((error) => showErrors(error));
    }
  }

  return (
    <Modal show={true} size="3xl" onClose={onClose}>
      <ModalHeader className="bg-lime-100 border-b-2 border-lime-300 font-semibold" style={{ color: '#000' }}>
        {plan ? "Diyet Planını Düzenle" : "Yeni Diyet Planı Oluştur"}
      </ModalHeader>
      <ModalBody className="bg-gradient-to-br from-lime-50 to-white text-black">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="font-semibold" style={{ color: '#000' }}>Plan Başlığı *</Label>
              <TextInput
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Örn: Kilo Verme Programı"
              />
            </div>
            <div>
              <Label htmlFor="clientId" className="font-semibold" style={{ color: '#000' }}>Danışan *</Label>
              <Select
                id="clientId"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: +e.target.value })}
                className={formData.clientId === 0 ? "border-red-500" : ""}
              >
                <option value={0}>Danışan Seçin</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.fullName} ({client.username})
                  </option>
                ))}
              </Select>
              {formData.clientId === 0 && (
                <p className="text-red-500 text-xs mt-1">Bu alan zorunludur</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="font-semibold" style={{ color: '#000' }}>Açıklama *</Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Diyet planının genel açıklaması..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="font-semibold" style={{ color: '#000' }}>Başlangıç Tarihi *</Label>
              <TextInput
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="font-semibold" style={{ color: '#000' }}>Bitiş Tarihi *</Label>
              <TextInput
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-lime-50 p-4 rounded-lg border-2 border-lime-200">
            <h3 className="font-bold text-gray-800 mb-3">Öğün Planı</h3>

            <div className="space-y-3">
              <div>
                <Label htmlFor="breakfast" className="font-semibold" style={{ color: '#000' }}>🌅 Kahvaltı *</Label>
                <Textarea
                  id="breakfast"
                  rows={2}
                  value={formData.breakfast}
                  onChange={(e) => setFormData({ ...formData, breakfast: e.target.value })}
                  placeholder="Örn: 2 yumurta, tam buğday ekmeği, yeşillik..."
                />
              </div>

              <div>
                <Label htmlFor="lunch" className="font-semibold" style={{ color: '#000' }}>☀️ Öğle Yemeği *</Label>
                <Textarea
                  id="lunch"
                  rows={2}
                  value={formData.lunch}
                  onChange={(e) => setFormData({ ...formData, lunch: e.target.value })}
                  placeholder="Örn: Izgara tavuk, salata, bulgur pilavı..."
                />
              </div>

              <div>
                <Label htmlFor="dinner" className="font-semibold" style={{ color: '#000' }}>🌙 Akşam Yemeği *</Label>
                <Textarea
                  id="dinner"
                  rows={2}
                  value={formData.dinner}
                  onChange={(e) => setFormData({ ...formData, dinner: e.target.value })}
                  placeholder="Örn: Balık, zeytinyağlı sebze..."
                />
              </div>

              <div>
                <Label htmlFor="snacks" className="font-semibold" style={{ color: '#000' }}>🍎 Ara Öğünler *</Label>
                <Textarea
                  id="snacks"
                  rows={2}
                  value={formData.snacks}
                  onChange={(e) => setFormData({ ...formData, snacks: e.target.value })}
                  placeholder="Örn: Meyve, yoğurt, çiğ fındık..."
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="font-semibold" style={{ color: '#000' }}>📝 Ek Notlar</Label>
            <Textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Özel talimatlar, alerjiler, öneriler..."
            />
          </div>

          <div className="flex gap-3 pt-4 border-t-2 border-lime-200">
            <Button onClick={handleSubmit} className="flex-1 bg-lime-400 hover:bg-lime-500 text-gray-800">
              {plan ? "Güncelle" : "Oluştur"}
            </Button>
            <Button onClick={onClose} color="gray" className="flex-1">
              İptal
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DietPlanFormModal;