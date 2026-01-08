import { useEffect, useState } from "react";
import { api } from "../../helper/api.ts";
import type { Client } from "../../types/Client.ts";
import { Card, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { FaEnvelope, FaPhone, FaUser } from "react-icons/fa";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext.js";
import { toast } from "sonner";

const DietitianClients = () => {
  const { loggedInUser } = useLoggedInUsersContext();
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    if (loggedInUser?.role === "DIYETISYEN") {
      fetchClients();
    }
  }, [loggedInUser]);

  function fetchClients() {
    api.get("auth/clients")
      .then((res) => {
        setClients(res.data);
      })
      .catch((error) => {
        console.error("Danışan listesi yükleme hatası:", error);
        toast.error("Danışan listesi yüklenemedi");
      });
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Danışanlarım</h1>

      <div className="bg-white rounded-lg shadow-lg border-2 border-lime-300 overflow-hidden">
        <Table>
          <TableHead className="bg-pink-600">
            <TableRow>
              <TableHeadCell className="!text-white">ID</TableHeadCell>
              <TableHeadCell className="!text-white">Ad Soyad</TableHeadCell>
              <TableHeadCell className="!text-white">Kullanıcı Adı</TableHeadCell>
              <TableHeadCell className="!text-white">Email</TableHeadCell>
              <TableHeadCell className="!text-white">Telefon</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id} className="hover:bg-lime-50">
                <TableCell>{client.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FaUser className="text-lime-600" />
                    <span className="font-semibold">{client.fullName}</span>
                  </div>
                </TableCell>
                <TableCell>{client.username}</TableCell>
                <TableCell>
                  {client.email ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaEnvelope className="text-pink-400" />
                      {client.email}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {client.phone ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaPhone className="text-lime-600" />
                      {client.phone}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {clients.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Henüz sistemde kayıtlı danışan bulunmamaktadır.
          </div>
        )}
      </div>

      <Card className="mt-6 bg-gradient-to-br from-lime-100 to-lime-200 border-2 border-lime-300">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Toplam Danışan Sayısı</h2>
        <p className="text-4xl font-bold text-lime-700">{clients.length}</p>
      </Card>
    </div>
  );
};

export default DietitianClients;