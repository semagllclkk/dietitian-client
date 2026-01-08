import { useEffect, useState } from "react";
import { api } from "../../helper/api";

interface Appointment {
  id: number;
  appointmentDate: string;
  status?: string;
  dietitian?: { fullName: string };
  client?: { fullName: string };
}

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.request({
        url: "appointments",
        method: "get",
      });
      setAppointments(res.data);
    } catch (error) {
      console.error("Randevuları yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tüm Randevular</h2>
      {appointments.length === 0 ? (
        <p className="text-gray-600">Henüz randevu oluşturulmamış.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-blue-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Tarih</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Diyetisyen</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Danışan</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Durum</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => {
                let formattedDate = "Geçersiz Tarih";
                try {
                  const dateObj = new Date(appt.appointmentDate);
                  if (!isNaN(dateObj.getTime())) {
                    formattedDate = dateObj.toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  }
                } catch (e) {
                  formattedDate = appt.appointmentDate as any;
                }

                return (
                  <tr key={appt.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{formattedDate}</td>
                    <td className="border border-gray-300 px-4 py-2">{appt.dietitian?.fullName || "-"}</td>
                    <td className="border border-gray-300 px-4 py-2">{appt.client?.fullName || "-"}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className="px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-800">
                        {appt.status || "Zamanlandı"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
