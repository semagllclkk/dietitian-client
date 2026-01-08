import { useEffect, useState } from "react";
import { api } from "../../helper/api.ts";
import { Card } from "flowbite-react";
import { FaClipboardList, FaCalendarAlt } from "react-icons/fa";
import type { DietPlan } from "../../types/DietPlan";

const ClientDashboard = () => {
  const [activePlan, setActivePlan] = useState<DietPlan | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointmentsCount: 0,
    totalRecipes: 0,
    totalDietPlans: 0,
  });

  useEffect(() => {
    Promise.all([
      api.get("diet-plans/my-assigned-plans"),
      api.get("appointments/my-client-appointments"),
      api.get("recipes/client-accessible"),
    ]).then(([plansRes, appointmentsRes, recipesRes]) => {
      const plans = plansRes.data;
      const active = plans.find((p: DietPlan) => p.status === "ACTIVE");
      setActivePlan(active || null);

      const appointments = appointmentsRes.data;
      const upcoming = appointments
        .filter((a: any) => a.status === "PENDING" || a.status === "CONFIRMED")
        .slice(0, 3);
      setUpcomingAppointments(upcoming);

      const recipes = recipesRes.data || [];
      setStats({
        totalAppointments: appointments.length,
        upcomingAppointmentsCount: appointments.filter(
          (a: any) => a.status === "PENDING" || a.status === "CONFIRMED"
        ).length,
        totalRecipes: recipes.length,
        totalDietPlans: plans.length,
      });
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-lime-100 to-lime-200 border-2 border-lime-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Yaklaşan Randevular</p>
              <p className="text-3xl font-bold text-gray-800">{stats.upcomingAppointmentsCount}</p>
            </div>
            <FaCalendarAlt className="text-4xl text-lime-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Randevu</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalAppointments}</p>
            </div>
            <FaCalendarAlt className="text-4xl text-green-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-pink-100 to-pink-200 border-2 border-pink-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tarif Sayısı</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalRecipes}</p>
            </div>
            <FaClipboardList className="text-4xl text-pink-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Diyet Planı Sayısı</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalDietPlans}</p>
            </div>
            <FaClipboardList className="text-4xl text-yellow-600" />
          </div>
        </Card>
      </div>

      {activePlan ? (
        <Card className="mb-6 bg-gradient-to-br from-lime-100 to-lime-200 border-2 border-lime-300">
          <div className="flex items-start gap-4">
            <FaClipboardList className="text-4xl text-lime-600 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Aktif Diyet Planınız
              </h2>
              <p className="text-lg font-semibold text-gray-700 mb-1">
                {activePlan.title}
              </p>
              <p className="text-sm text-gray-600">
                {activePlan.description}
              </p>
              <div className="mt-3 flex gap-4 text-sm text-gray-600">
                <span>
                  📅 Başlangıç: {new Date(activePlan.startDate).toLocaleDateString("tr-TR")}
                </span>
                <span>
                  📅 Bitiş: {new Date(activePlan.endDate).toLocaleDateString("tr-TR")}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="mb-6 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300">
          <p className="text-gray-600 text-center">
            Henüz aktif bir diyet planınız bulunmamaktadır.
          </p>
        </Card>
      )}

      <Card className="bg-white border-2 border-pink-300">
        <div className="flex items-center gap-3 mb-4">
          <FaCalendarAlt className="text-2xl text-pink-600" />
          <h2 className="text-xl font-bold text-gray-400">
            Yaklaşan Randevularınız
          </h2>
        </div>
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 bg-pink-50 rounded-lg border border-pink-200"
              >
                <p className="font-semibold text-gray-800">
                  {appointment.dietitian.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  📅 {new Date(appointment.appointmentDate).toLocaleString("tr-TR")}
                </p>
                {appointment.notes && (
                  <p className="text-sm text-gray-600 mt-1">
                    💬 {appointment.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            Yaklaşan randevunuz bulunmamaktadır.
          </p>
        )}
      </Card>
    </div>
  );
};

export default ClientDashboard;