import { useEffect, useState } from "react";
import { api } from "../../helper/api.ts";
import type { Appointment } from "../../types/Appointment.ts";
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import AppointmentFormModal from "./AppointmentFormModal.tsx";
import DeleteConfirmModal from "../shared/DeleteConfirmModal.tsx";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext.js";

const DietitianAppointments = () => {
  const { loggedInUser } = useLoggedInUsersContext();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);

  useEffect(() => {
    if (loggedInUser?.role === "DIYETISYEN") {
      fetchAppointments();
    }
  }, [loggedInUser]);

  function fetchAppointments() {
    api.get("appointments/my-appointments")
      .then((res) => {
        setAppointments(res.data);
      })
      .catch((error) => {
        console.error("Randevu listesi yükleme hatası:", error);
        toast.error("Randevu listesi yüklenemedi");
      });
  }

  function handleEdit(appointment: Appointment) {
    setSelectedAppointment(appointment);
    setShowForm(true);
  }

  function handleDeleteClick(appointment: Appointment) {
    setAppointmentToDelete(appointment);
    setShowDelete(true);
  }

  function handleDelete() {
    if (!appointmentToDelete) return;
    
    api.delete(`appointments/${appointmentToDelete.id}`)
      .then(() => {
        toast.success("Randevu silindi");
        fetchAppointments();
        setShowDelete(false);
        setAppointmentToDelete(null);
      })
      .catch(() => {
        toast.error("Silme işlemi başarısız");
      });
  }

  function getStatusBadge(status: string) {
    const badges: Record<string, string> = {
      PENDING: "bg-yellow-300 text-gray-800",
      CONFIRMED: "bg-lime-400 text-gray-800",
      COMPLETED: "bg-green-400 text-white",
      CANCELLED: "bg-red-400 text-white",
    };
    const labels: Record<string, string> = {
      PENDING: "Beklemede",
      CONFIRMED: "Onaylandı",
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
        <h1 className="text-3xl font-bold text-gray-800">Randevularım</h1>
        <Button
          onClick={() => {
            setSelectedAppointment(null);
            setShowForm(true);
          }}
          className="bg-lime-400 hover:bg-lime-500 text-gray-800"
        >
          <FaPlus className="mr-2" /> Yeni Randevu Oluştur
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-lg border-2 border-lime-300 overflow-hidden">
        <Table>
          <TableHead className="bg-lime-50">
            <TableRow>
              <TableHeadCell className="!text-white">ID</TableHeadCell>
              <TableHeadCell className="!text-white">Danışan</TableHeadCell>
              <TableHeadCell className="!text-white">Tarih & Saat</TableHeadCell>
              <TableHeadCell className="!text-white">Durum</TableHeadCell>
              <TableHeadCell className="!text-white">Notlar</TableHeadCell>
              <TableHeadCell className="!text-white">İşlemler</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id} className="hover:bg-lime-50">
                <TableCell>{appointment.id}</TableCell>
                <TableCell className="font-semibold">
                  {appointment.client?.fullName || "Belirtilmemiş"}
                </TableCell>
                <TableCell>
                  {new Date(appointment.appointmentDate).toLocaleString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                <TableCell>
                  <span className="text-sm text-gray-800 font-medium">
                    {appointment.notes || "-"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="xs" color="green" onClick={() => handleEdit(appointment)}>
                      <FaEdit />
                    </Button>
                    <Button size="xs" color="red" onClick={() => handleDeleteClick(appointment)}>
                      <FaTrash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {appointments.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Henüz randevu oluşturmadınız.
          </div>
        )}
      </div>

      {showForm && (
        <AppointmentFormModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowForm(false);
            setSelectedAppointment(null);
          }}
          onSuccess={() => {
            fetchAppointments();
            setShowForm(false);
            setSelectedAppointment(null);
          }}
        />
      )}

      {showDelete && (
        <DeleteConfirmModal
          title="Randevuyu Sil"
          message="Bu randevuyu silmek istediğinizden emin misiniz?"
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDelete(false);
            setAppointmentToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default DietitianAppointments;