import { Button, Label, Modal, ModalBody, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import { api } from "../../helper/api.ts";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { showErrors } from "../../helper/helper.ts";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("DANISAN");

  function handleRegister() {
    api
      .request({
        url: "auth/register",
        method: "post",
        data: { username, password, fullName, email, phone, role },
      })
      .then(() => {
        toast.success("Kayıt başarılı! Giriş yapabilirsiniz.");
        navigate("/login");
      })
      .catch((error) => {
        showErrors(error);
      });
  }

  return (
    <Modal show={true} size="lg" popup>
      <div className="p-6 bg-gradient-to-br from-pink-50 via-white to-green-50">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          💕 Yeni Hesap Oluştur
        </h3>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="fullName" className="!text-gray-900 font-bold">Ad Soyad</Label>
              </div>
              <TextInput
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ahmet Yılmaz"
                className="border-lime-300 focus:border-lime-500"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username" className="!text-gray-900 font-bold">Kullanıcı Adı</Label>
              </div>
              <TextInput
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ahmetyilmaz"
                className="border-lime-300 focus:border-lime-500"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" className="!text-gray-900 font-bold">Şifre</Label>
              </div>
              <TextInput
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-lime-300 focus:border-lime-500"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" className="!text-gray-900 font-bold">Email (Opsiyonel)</Label>
              </div>
              <TextInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmet@example.com"
                className="border-lime-300 focus:border-lime-500"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="phone" className="!text-gray-900 font-bold">Telefon (Opsiyonel)</Label>
              </div>
              <TextInput
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0555 123 4567"
                className="border-lime-300 focus:border-lime-500"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="role" className="!text-gray-900 font-bold">Hesap Türü</Label>
              </div>
              <Select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border-lime-300 focus:border-lime-500"
              >
                <option value="DANISAN">Danışan</option>
                <option value="DIYETISYEN">Diyetisyen</option>
                <option value="ADMIN">Admin</option>
              </Select>
            </div>
            <div className="w-full space-y-3">
              <Button
                onClick={handleRegister}
                className="w-full bg-lime-400 hover:bg-lime-500 text-gray-800"
              >
                Kayıt Ol
              </Button>
              <div className="text-center text-sm text-gray-600">
                Hesabınız var mı?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-lime-600 hover:text-lime-700 font-semibold"
                >
                  Giriş Yap
                </button>
              </div>
            </div>
          </div>
        </ModalBody>
      </div>
    </Modal>
  );
};

export default Register;