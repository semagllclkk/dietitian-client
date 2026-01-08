import { useState, useEffect } from "react";
import { api } from "../../helper/api";
import { showErrors, showSuccess } from "../../helper/helper";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { FaUser, FaTrash, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLoggedInUsersContext } from "../auth/LoggedInUserContext";

const Profile = () => {
    const { loggedInUser, setLoggedInUser } = useLoggedInUsersContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (loggedInUser) {
            setFormData({
                fullName: loggedInUser.fullName || "",
                email: loggedInUser.email || "",
                phone: loggedInUser.phone || "",
                password: "",
                confirmPassword: "",
            });
        }
    }, [loggedInUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password && formData.password !== formData.confirmPassword) {
            showErrors({ response: { data: { message: "Şifreler eşleşmiyor" } } });
            return;
        }

        setLoading(true);

        const updateData: any = {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
        };

        if (formData.password) {
            updateData.password = formData.password;
        }

        try {
            const response = await api.patch("auth/profile", updateData);
            showSuccess("Profil başarıyla güncellendi");

            setLoggedInUser({
                ...loggedInUser!,
                fullName: response.data.fullName,
                email: response.data.email,
                phone: response.data.phone,
            });

            setFormData({
                ...formData,
                password: "",
                confirmPassword: "",
            });
        } catch (error) {
            showErrors(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!")) {
            return;
        }

        if (!window.confirm("SON UYARI: Tüm verileriniz silinecektir. Devam etmek istiyor musunuz?")) {
            return;
        }

        try {
            await api.delete("auth/profile");
            showSuccess("Hesabınız başarıyla silindi");

            localStorage.removeItem("token");
            setLoggedInUser(null);
            navigate("/");
        } catch (error) {
            showErrors(error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-br from-lime-50 to-pink-50 border-2 border-lime-300">
                <div className="flex items-center gap-3 mb-6">
                    <FaUser className="text-3xl text-lime-600" />
                    <h1 className="text-3xl font-bold text-gray-800">Profil Ayarları</h1>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                        <Label htmlFor="username" className="font-semibold text-black" style={{ color: '#000' }}>Kullanıcı Adı</Label>
                        <TextInput
                            id="username"
                            value={loggedInUser?.username || ""}
                            disabled
                            className="bg-gray-100"
                        />
                        <p className="text-sm text-gray-500 mt-1">Kullanıcı adı değiştirilemez</p>
                    </div>

                    <div>
                        <Label htmlFor="fullName" className="font-semibold text-black" style={{ color: '#000' }}>Tam Ad</Label>
                        <TextInput
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="email" className="font-semibold text-black" style={{ color: '#000' }}>E-posta</Label>
                        <TextInput
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="phone" className="font-semibold text-black" style={{ color: '#000' }}>Telefon</Label>
                        <TextInput
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <hr className="my-6" />

                    <h3 className="text-lg font-bold text-gray-800 mb-3">Şifre Değiştir (Opsiyonel)</h3>

                    <div>
                        <Label htmlFor="password" className="font-semibold text-black" style={{ color: '#000' }}>Yeni Şifre</Label>
                        <TextInput
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Boş bırakın değiştirmek istemiyorsanız"
                        />
                    </div>

                    <div>
                        <Label htmlFor="confirmPassword" className="font-semibold text-black" style={{ color: '#000' }}>Yeni Şifre (Tekrar)</Label>
                        <TextInput
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Şifreyi tekrar girin"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold"
                    >
                        <FaSave className="mr-2" />
                        {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                    </Button>
                </form>

                <hr className="my-8" />

                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-red-800 mb-2">Tehlikeli Bölge</h3>
                    <p className="text-sm text-red-700 mb-4">
                        Hesabınızı silerseniz, tüm verileriniz kalıcı olarak silinecektir.
                    </p>
                    <Button
                        color="failure"
                        onClick={handleDeleteAccount}
                        className="w-full"
                    >
                        <FaTrash className="mr-2" />
                        Hesabımı Sil
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default Profile;
