import { useEffect, useState } from "react";
import { api } from "../../helper/api";
import type { Appointment } from "../../types/Appointment";
import { Button, Card } from "flowbite-react";
import { FaCalendarAlt, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import ClientAppointmentFormModal from "./ClientAppointmentFormModal";
import DeleteConfirmModal from "../shared/DeleteConfirmModal";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext";

const ClientAppointments = () => {
  const { loggedInUser } = useLoggedInUsersContext();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);

  useEffect(() => {
    if (loggedInUser?.role === "DANISAN") {
      fetchAppointments();
    }
  }, [loggedInUser]);

  function fetchAppointments() {
    api.get("appointments/my-client-appointments")
      .then((res) => {
        setAppointments(res.data);
      })
      .catch((error) => {
        console.error("Randevu listesi yükleme hatası:", error);
        toast.error("Randevu listesi yüklenemedi");
      });
  }

  function handleDeleteClick(appointment: Appointment) {
    setAppointmentToDelete(appointment);
    setShowDelete(true);
  }

  function handleDelete() {
    if (!appointmentToDelete) return;

    api.delete(`appointments/${appointmentToDelete.id}`)
      .then(() => {
        toast.success("Randevu iptal edildi");
        fetchAppointments();
        setShowDelete(false);
        setAppointmentToDelete(null);
      })
      .catch(() => {
        toast.error("İptal işlemi başarısız");
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

  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.appointmentDate) >= new Date() && (a.status === "PENDING" || a.status === "CONFIRMED")
  );
  const pastAppointments = appointments.filter(
    (a) => new Date(a.appointmentDate) < new Date() || a.status === "COMPLETED" || a.status === "CANCELLED"
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Randevularım</h1>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-lime-400 hover:bg-lime-500 text-gray-800"
        >
          <FaCalendarAlt className="mr-2" /> Randevu Talep Et
        </Button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📅 Yaklaşan Randevular</h2>
        <div className="grid grid-cols-1 gap-4">
          {upcomingAppointments.map((appointment) => (
            <Card key={appointment.id} className="bg-gradient-to-br from-lime-100 to-lime-200 border-2 border-lime-300">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FaCalendarAlt className="text-2xl text-lime-600" />
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        {appointment.dietitian?.fullName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(appointment.appointmentDate).toLocaleString("tr-TR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  {appointment.notes && (
                    <p className="text-gray-700 mt-2 bg-white p-3 rounded-lg">
                      💬 {appointment.notes}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {getStatusBadge(appointment.status)}
                  {appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED" && (
                    <Button
                      size="xs"
                      color="red"
                      onClick={() => handleDeleteClick(appointment)}
                    >
                      <FaTrash className="mr-1" /> İptal Et
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
          {upcomingAppointments.length === 0 && (
            <Card className="bg-gray-100">
              <p className="text-gray-600 text-center">
                Yaklaşan randevunuz bulunmamaktadır.
              </p>
            </Card>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Geçmiş Randevular</h2>
        <div className="grid grid-cols-1 gap-4">
          {pastAppointments.map((appointment) => (
            <Card key={appointment.id} className="bg-white border-2 border-gray-300 opacity-75">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FaCalendarAlt className="text-xl text-gray-500" />
                    <div>
                      <h3 className="font-bold text-white">
                        {appointment.dietitian?.fullName}
                      </h3>
                      <p className="text-sm text-black">
                        {new Date(appointment.appointmentDate).toLocaleString("tr-TR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: undefined
                        })}
                      </p>
                    </div>
                  </div>
                  {appointment.notes && (
                    <p className="text-black text-sm mt-2 font-medium">
                      💬 {appointment.notes}
                    </p>
                  )}
                </div>
                {getStatusBadge(appointment.status)}
              </div>
            </Card>
          ))}
          {pastAppointments.length === 0 && (
            <Card className="bg-gray-100">
              <p className="text-gray-600 text-center">
                Geçmiş randevu kaydı bulunmamaktadır.
              </p>
            </Card>
          )}
        </div>
      </div>

      {showForm && (
        <ClientAppointmentFormModal
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchAppointments();
            setShowForm(false);
          }}
        />
      )}

      {showDelete && (
        <DeleteConfirmModal
          title="Randevuyu İptal Et"
          message="Bu randevuyu iptal etmek istediğinizden emin misiniz?"
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

export default ClientAppointments;