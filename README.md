# Diyetisyen Takip Sistemi

NestJS ve React kullanılarak geliştirilmiş, rol tabanlı yetkilendirme ile çalışan kapsamlı bir diyetisyen-danışan takip ve yönetim sistemi.

## Özellikler

### 🔐 Kimlik Doğrulama ve Yetkilendirme
- JWT tabanlı güvenli oturum yönetimi
- Rol tabanlı erişim kontrolü (Admin, Diyetisyen, Danışan)
- Her kullanıcı kendi profilini güncelleyebilir
- Kullanıcılar hesaplarını silebilir (Admin hariç)

### 👥 Kullanıcı Yönetimi
- **Admin**: Tüm kullanıcıları görüntüleme ve silme (Admin hariç)
- **Diyetisyen**: Danışanları görüntüleme
- **Danışan**: Diyetisyenleri görüntüleme
- Profil güncelleme (Ad, email, telefon, şifre)

### 📋 Diyet Planı Yönetimi
- Diyetisyenler özelleştirilmiş diyet planları oluşturabilir
- Plan detayları: Kahvaltı, öğle yemeği, akşam yemeği, atıştırmalıklar
- Plan durumu takibi (Aktif, Tamamlandı, İptal Edildi)
- Diyetisyenler kendi planlarını düzenleyebilir ve silebilir
- Admin tüm planları silebilir
- Danışanlar kendilerine atanan planları görüntüleyebilir

### 📅 Randevu Sistemi
- Diyetisyen ve danışanlar randevu oluşturabilir
- Randevu durumu takibi (Beklemede, Onaylandı, Tamamlandı, İptal)
- Randevu notları ekleme
- Diyetisyenler ve danışanlar kendi randevularını yönetebilir
- Admin tüm randevuları silebilir

### 🍽️ Tarif Yönetimi
- Diyetisyenler tarif oluşturabilir ve paylaşabilir
- Tarif kategorileri: Kahvaltı, Ana Yemek, Tatlı, Ara Öğün, Çorba, Salata, İçecek
- Tarif detayları: Hazırlık süresi, pişirme süresi, porsiyon, kalori
- Genel (public) veya özel tarifler
- Diyetisyenler kendi tariflerini düzenleyebilir ve silebilir
- Admin tüm tarifleri silebilir
- Danışanlar kendilerine açık tarifleri görüntüleyebilir

### 📊 Dashboard ve Raporlama
- **Diyetisyen Dashboard**: İstatistikler, aktif planlar, yaklaşan randevular
- **Danışan Dashboard**: Kişisel planlar, yaklaşan randevular, erişilebilir tarifler
- **Admin Dashboard**: Sistem geneli istatistikler ve kullanıcı yönetimi

## Teknolojiler

### Backend
- **NestJS** - Modüler ve ölçeklenebilir backend framework
- **TypeORM** - Veritabanı ORM
- **PostgreSQL** - İlişkisel veritabanı
- **JWT** - Güvenli kimlik doğrulama
- **bcrypt** - Şifre hashleme
- **class-validator** - DTO validasyonu

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **Flowbite React** - UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Sonner** - Toast notifications

## Kurulum

### Gereksinimler
- Node.js (v16+)
- PostgreSQL (v13+)
- npm veya yarn

### Backend Kurulumu

1. Backend dizinine gidin:
```bash
cd backend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env.example` dosyasını kopyalayıp `.env` oluşturun:
```bash
copy .env.example .env   # Windows
cp .env.example .env     # Linux/Mac
```

4. `.env` dosyasını düzenleyin ve veritabanı bilgilerinizi girin.

5. PostgreSQL veritabanını oluşturun:
```sql
CREATE DATABASE dbWeb;
```

6. Backend'i başlatın:
```bash
npm run start:dev
```

Backend varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

### Frontend Kurulumu

1. Frontend dizinine gidin:
```bash
cd frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Frontend'i başlatın:
```bash
npm run dev
```

Frontend varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.

## Varsayılan Kullanıcılar

### Admin
- Kullanıcı Adı: `admin`
- Şifre: `admin123`

## Önemli Notlar

- Kullanıcılar kendi hesaplarını silebilir (Admin kullanıcıları hariç)
- Diyetisyenler sadece kendi oluşturdukları içerikleri (tarifler, planlar, randevular) silebilir
- Admin tüm içerikleri silebilir ancak kendi hesabını silemez
- Tüm silme işlemleri onay dialogu ile korunmaktadır

## Lisans

MIT
