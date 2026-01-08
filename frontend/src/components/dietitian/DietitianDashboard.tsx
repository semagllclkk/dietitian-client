import { useEffect, useState } from "react";
import { api } from "../../helper/api.js";
import { Card } from "flowbite-react";
import { FaClipboardList, FaCalendarAlt } from "react-icons/fa";

const DietitianDashboard = () => {
  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
    totalAppointments: 0,
    upcomingAppointments: 0,
  });

  useEffect(() => {
    Promise.all([
      api.get("diet-plans/my-plans"),
      api.get("appointments/my-appointments"),
    ]).then(([plansRes, appointmentsRes]) => {
      const plans = plansRes.data;
      const appointments = appointmentsRes.data;

      setStats({
        totalPlans: plans.length,
        activePlans: plans.filter((p: any) => p.status === "ACTIVE").length,
        totalAppointments: appointments.length,
        upcomingAppointments: appointments.filter(
          (a: any) => a.status === "PENDING" || a.status === "CONFIRMED"
        ).length,
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
              <p className="text-sm text-gray-600">Toplam Diyet Planı</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalPlans}</p>
            </div>
            <FaClipboardList className="text-4xl text-lime-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktif Planlar</p>
              <p className="text-3xl font-bold text-gray-800">{stats.activePlans}</p>
            </div>
            <FaClipboardList className="text-4xl text-green-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-pink-100 to-pink-200 border-2 border-pink-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Randevu</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalAppointments}</p>
            </div>
            <FaCalendarAlt className="text-4xl text-pink-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Yaklaşan Randevular</p>
              <p className="text-3xl font-bold text-gray-800">{stats.upcomingAppointments}</p>
            </div>
            <FaCalendarAlt className="text-4xl text-yellow-600" />
          </div>
        </Card>
      </div>

      <Card className="bg-gray-800 border-2 border-lime-300">
        <h2 className="text-xl font-bold text-gray-200 mb-3">
          Hoş Geldiniz! 👋
        </h2>
        <p className="text-gray-300">
          Diyetisyen paneline hoş geldiniz. Sol menüden danışanlarınızı, diyet planlarınızı ve randevularınızı yönetebilirsiniz.
        </p>
      </Card>
    </div>
  );
};

export default DietitianDashboard;
