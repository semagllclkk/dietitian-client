import { useEffect, useState } from "react";
import { api } from "../../helper/api";
import { showErrors, showSuccess } from "../../helper/helper";

interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  email: string;
  phone: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [dietitians, setDietitians] = useState(0);
  const [clients, setClients] = useState(0);
  const [dietPlans, setDietPlans] = useState(0);
  const [appointments, setAppointments] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersRes = await api.request({
        url: "auth/users",
        method: "get",
      });

      const allUsers = usersRes.data;
      setUsers(allUsers);

      const dietCount = allUsers.filter((u: User) => u.role === "DIYETISYEN").length;
      const clientCount = allUsers.filter((u: User) => u.role === "DANISAN").length;
      setDietitians(dietCount);
      setClients(clientCount);

      try {
        const plansRes = await api.request({
          url: "diet-plans",
          method: "get",
        });
        setDietPlans(Array.isArray(plansRes.data) ? plansRes.data.length : 0);
      } catch (err) {
        setDietPlans(0);
      }

      try {
        const apptRes = await api.request({
          url: "appointments",
          method: "get",
        });
        setAppointments(Array.isArray(apptRes.data) ? apptRes.data.length : 0);
      } catch (err) {
        setAppointments(0);
      }
    } catch (error) {
      console.error("Veri yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number, username: string) => {
    if (!window.confirm(`${username} kullanıcısını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      await api.delete(`auth/users/${userId}`);
      showSuccess("Kullanıcı başarıyla silindi");
      fetchData(); // Refresh the list
    } catch (error: any) {
      showErrors(error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Veriler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-l-4 border-blue-400">
            <div className="text-4xl font-bold text-blue-600">{users.length}</div>
            <div className="text-sm text-gray-600 mt-2">Toplam Kullanıcı</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-l-4 border-green-400">
            <div className="text-4xl font-bold text-green-600">{dietitians}</div>
            <div className="text-sm text-gray-600 mt-2">Diyetisyen</div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 border-l-4 border-pink-400">
            <div className="text-4xl font-bold text-pink-600">{clients}</div>
            <div className="text-sm text-gray-600 mt-2">Danışan</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border-l-4 border-yellow-400">
            <div className="text-4xl font-bold text-yellow-600">{dietPlans}</div>
            <div className="text-sm text-gray-600 mt-2">Diyet Planları</div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Kullanıcı Yönetimi</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tam Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'DIYETISYEN' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          className="text-red-600 hover:text-red-900 font-semibold"
                        >
                          Sil
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">Sistem İstatistikleri</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>✅ Toplam Randevular: {appointments}</li>
              <li>✅ Aktif Kullanıcılar: {users.length}</li>
              <li>✅ Sistem İçerik: {dietPlans + appointments} öğe</li>
            </ul>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
            <h3 className="font-semibold text-purple-900 mb-2">Admin Özellikleri</h3>
            <ul className="space-y-2 text-sm text-purple-800">
              <li>✅ Tüm kullanıcıları görüntüle</li>
              <li>✅ Kullanıcıları sil (ADMIN hariç)</li>
              <li>✅ Tüm diyet planlarını listele</li>
              <li>✅ Tüm randevuları görüntüle</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
