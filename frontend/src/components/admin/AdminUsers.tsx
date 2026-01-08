import { useEffect, useState } from "react";
import { api } from "../../helper/api";

interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  email: string;
  phone: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.request({
        url: "auth/users",
        method: "get",
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Kullanıcıları yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tüm Kullanıcılar</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-blue-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Ad Soyad</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Kullanıcı Adı</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Rol</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Telefon</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{user.fullName}</td>
                <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${
                    user.role === "DIYETISYEN" ? "bg-green-100 text-green-800" :
                    user.role === "DANISAN" ? "bg-pink-100 text-pink-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>
                    {user.role === "DIYETISYEN" ? "Diyetisyen" : user.role === "DANISAN" ? "Danışan" : "Admin"}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">{user.email || "-"}</td>
                <td className="border border-gray-300 px-4 py-2">{user.phone || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
