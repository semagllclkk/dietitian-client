import { Button, Label, Modal, ModalBody, ModalHeader, Select, TextInput, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { api } from "../../helper/api";
import { toast } from "sonner";
import { showErrors } from "../../helper/helper";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext";

interface Dietitian {
  id: number;
  fullName: string;
  username: string;
  email?: string;
  phone?: string;
}

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const ClientAppointmentFormModal = ({ onClose, onSuccess }: Props) => {
  const { loggedInUser } = useLoggedInUsersContext();
  const [dietitians, setDietitians] = useState<Dietitian[]>([]);
  const [formData, setFormData] = useState({
    appointmentDate: "",
    notes: "",
    dietitianId: 0,
  });

  useEffect(() => {
    if (loggedInUser?.role === "DANISAN") {
      api.get("auth/dietitians")
        .then((res) => {
          setDietitians(res.data);
        })
        .catch((error) => {
          console.error("Diyetisyen listesi yükleme hatası:", error);
          toast.error("Diyetisyen listesi yüklenemedi");
        });
    }
  }, [loggedInUser]);

  function handleSubmit() {
    if (!formData.dietitianId || formData.dietitianId === 0) {
      toast.error("Lütfen bir diyetisyen seçin");
      return;
    }

    if (!formData.appointmentDate) {
      toast.error("Lütfen randevu tarihini seçin");
      return;
    }

    const payload: any = {
      notes: formData.notes,
      dietitianId: formData.dietitianId,
    };

    try {
      payload.appointmentDate = new Date(formData.appointmentDate).toISOString();
    } catch (e) {
      toast.error("Geçersiz tarih formatı");
      return;
    }

    api.post("appointments", payload)
      .then(() => {
        toast.success("Randevu talebiniz oluşturuldu");
        onSuccess();
      })
      .catch((error) => {
        console.error("Randevu hatası:", error);
        showErrors(error);
      });
  }

  return (
    <Modal show={true} size="lg" onClose={onClose}>
      <ModalHeader className="bg-gradient-to-br from-black to-pink-400 border-lime-300 !text-gray-900 font-semibold">
        Randevu Talep Et
      </ModalHeader>
      <ModalBody className="bg-gradient-to-br from-lime-400 to-pink-400">
        <div className="space-y-4">
          <div>
            <Label htmlFor="dietitianId">Diyetisyen Seçin *</Label>
            <Select
              id="dietitianId"
              value={formData.dietitianId}
              onChange={(e) => setFormData({ ...formData, dietitianId: +e.target.value })}
            >
              <option value={0}>Diyetisyen Seçin</option>
              {dietitians.map((dietitian) => (
                <option key={dietitian.id} value={dietitian.id}>
                  {dietitian.fullName} ({dietitian.username})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="appointmentDate">Tercih Ettiğiniz Tarih ve Saat *</Label>
            <TextInput
              id="appointmentDate"
              type="datetime-local"
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">
              Diyetisyen randevuyu onayladıktan sonra kesinleşecektir.
            </p>
          </div>

          <div>
            <Label htmlFor="notes">Notlar (Opsiyonel)</Label>
            <Textarea
              id="notes"
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Randevu hakkında özel notlarınız veya talepleriniz..."
            />
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-gray-700">
              ℹ️ Randevu talebiniz diyetisyeniniz tarafından onaylandığında size bildirim gelecektir.
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t-2 border-lime-200">
            <Button onClick={handleSubmit} className="flex-1 bg-lime-400 hover:bg-lime-500 text-gray-800">
              Randevu Talep Et
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

export default ClientAppointmentFormModal;