import { Button, Label, Modal, ModalBody, TextInput } from "flowbite-react";
import { useState } from "react";
import { api } from "../helper/api.js";
import { setToken } from "../helper/api";
import Cookies from "universal-cookie";
import { useLoggedInUsersContext } from "./auth/LoggedInUserContext.js";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const Login = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const { setLoggedInUser } = useLoggedInUsersContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    api
      .request({
        url: "auth/login",
        method: "post",
        data: { username, password },
      })
      .then((res) => {
        cookies.set("loggedInUser", JSON.stringify(res.data), {
          expires: new Date(Date.now() + 1000 * 60 * 60),
        });
        setLoggedInUser(res.data);
        setToken(res.data.accessToken);
        toast.success("Giriş başarılı!");

        if (res.data.role === "DIYETISYEN") {
          navigate("/dietitian/dashboard");
        } else if (res.data.role === "DANISAN") {
          navigate("/client/dashboard");
        } else if (res.data.role === "ADMIN") {
          navigate("/admin/dashboard");
        }
      })
      .catch(() => {
        toast.error("Kullanıcı adı veya şifre hatalı!");
      });
  }

  return (
    <Modal show={true} size="md" popup>
      <div className="p-6 bg-gradient-to-br from-green-50 via-white to-pink-50">
        <h3 className="text-2xl font-bold text-center mb-6 !text-gray-900">
          🥗 Diyetisyen Takip Sistemi
        </h3>
        <ModalBody>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username" className="!text-gray-900 font-medium">
                  Kullanıcı Adı
                </Label>
              </div>
              <TextInput
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-green-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" className="!text-gray-900 font-medium">
                  Şifre
                </Label>
              </div>
              <TextInput
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-green-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div className="w-full space-y-3">
              <Button
                onClick={handleLogin}
                className="w-full bg-lime-400 hover:bg-lime-500 hover:shadow-lg transition-all duration-300 text-gray-800 font-semibold"
              >
                Giriş Yap
              </Button>
              <div className="text-center text-sm text-gray-600">
                Hesabınız yok mu?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="font-semibold transition-colors duration-200 text-pink-400 hover:text-pink-500"
                >
                  Kayıt Ol
                </button>
              </div>
            </div>
          </div>
        </ModalBody>
      </div>
    </Modal>
  );
};

export default Login;