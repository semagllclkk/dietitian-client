import { Button, Label, Modal, ModalBody, ModalHeader, Select, TextInput, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { api } from "../../helper/api.js";
import { toast } from "sonner";
import { showErrors } from "../../helper/helper.js";
import type { Appointment } from "../../types/Appointment";
import type { Client } from "../../types/Client";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext.js";

interface Props {
  appointment: Appointment | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AppointmentFormModal = ({ appointment, onClose, onSuccess }: Props) => {
  const { loggedInUser } = useLoggedInUsersContext();
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    appointmentDate: appointment
      ? new Date(appointment.appointmentDate).toISOString().slice(0, 16)
      : "",
    notes: appointment?.notes || "",
    clientId: appointment?.clientId || 0,
    dietitianId: appointment?.dietitian?.id || 0,
    status: appointment?.status || "PENDING",
  });

  useEffect(() => {
    if (loggedInUser?.role === "DIYETISYEN") {
      api.get("auth/clients").then((res) => {
        setClients(res.data);
      });
    }
  }, [loggedInUser]);

  function handleSubmit() {
    if (!formData.appointmentDate) {
      toast.error("Lütfen randevu tarihi seçin");
      return;
    }

    if (loggedInUser?.role === "DIYETISYEN") {
      if (formData.clientId === 0) {
        toast.error("Lütfen bir danışan seçin");
        return;
      }
    } else if (loggedInUser?.role === "DANISAN") {
      if (formData.dietitianId === 0) {
        toast.error("Lütfen bir diyetisyen seçin");
        return;
      }
    }

    let payload: any = {
      appointmentDate: new Date(formData.appointmentDate).toISOString(),
      notes: formData.notes,
    };

    if (loggedInUser?.role === "DIYETISYEN") {
      payload.clientId = formData.clientId;
    } else if (loggedInUser?.role === "DANISAN") {
      payload.dietitianId = formData.dietitianId;
    }

    if (appointment) {
      api.patch(`appointments/${appointment.id}`, { ...payload, status: formData.status })
        .then(() => {
          toast.success("Randevu güncellendi");
          onSuccess();
        })
        .catch((error) => showErrors(error));
    } else {
      api.post("appointments", payload)
        .then(() => {
          toast.success("Randevu oluşturuldu");
          onSuccess();
        })
        .catch((error) => showErrors(error));
    }
  }

  return (
    <Modal show={true} size="lg" onClose={onClose}>
      <ModalHeader className="bg-gradient-to-br from-black to-pink-400 border-lime-300 !text-gray-900 font-semibold">
        {appointment ? "Randevuyu Düzenle" : "Yeni Randevu Oluştur"}
      </ModalHeader>
      <ModalBody className="bg-gradient-to-br from-lime-400 to-pink-400">
        <div className="space-y-4">
          <div>
            <Label htmlFor="clientId">Danışan *</Label>
            <Select
              id="clientId"
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: +e.target.value })}
              disabled={!!appointment}
            >
              <option value={0}>Danışan Seçin</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.fullName} ({client.username})
                </option>
              ))}
            </Select>
            {appointment && (
              <p className="text-xs text-gray-500 mt-1">
                Danışan değiştirilemez
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="appointmentDate">Randevu Tarihi ve Saati *</Label>
            <TextInput
              id="appointmentDate"
              type="datetime-local"
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="status">Durum</Label>
            <Select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="PENDING">Beklemede</option>
              <option value="CONFIRMED">Onaylandı</option>
              <option value="COMPLETED">Tamamlandı</option>
              <option value="CANCELLED">İptal Edildi</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notlar</Label>
            <Textarea
              id="notes"
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Randevu ile ilgili notlarınız..."
            />
          </div>

          <div className="flex gap-3 pt-4 border-t-2 border-lime-200">
            <Button onClick={handleSubmit} className="flex-1 bg-lime-400 hover:bg-lime-500 text-gray-800">
              {appointment ? "Güncelle" : "Oluştur"}
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

export default AppointmentFormModal;