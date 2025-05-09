# 🐾 Pet Adoption Platform API

REST API sederhana untuk platform adopsi hewan berbasis **Node.js** dan **Firebase Firestore**.
- Melihat hewan yang tersedia untuk diadopsi
- Mengajukan permintaan adopsi
- Mengelola hewan (oleh admin)
- Menyetujui atau menolak permintaan adopsi

---

## 🚀 Teknologi yang Digunakan
- **Node.js** & **Express.js** – Backend RESTful API
- **Firebase Firestore** – Database firestore
- **Firebase Admin SDK** – Akses server ke Firestore
- **JWT (jsonwebtoken)** – Autentikasi berbasis token
- **bcryptjs** – Enkripsi password
- **express-validator** – Validasi data input

---

## 📂 Struktur Koleksi Firestore

### 🧑 users
```json
{
  "uid": "auto_generated",
  "name": "Ryan Arsyad",
  "email": "ryan@example.com",
  "password": "hashed_password",
  "phone": "081234567890",
  "address": "Jl. Mawar No.10",
  "role": "user", // atau "admin"
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 🐾 pets
```json
{
  "id": "auto_generated",
  "name": "Doggy",
  "species": "Dog",
  "age": 3,
  "description": "Friendly golden retriever",
  "available": true,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 📄 adoption_requests
```json
{
  "id": "auto_generated",
  "userId": "uid dari users",
  "petId": "id dari pets",
  "status": "pending", // approved / rejected / cancelled
  "requestedAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## 🔐 Keamanan Server

- 🔒 **JWT Authentication**  
  Seluruh endpoint privat dilindungi dengan token JWT. Token dikirim melalui header:
  ```
  Authorization: Bearer <token>
  ```

- 🔑 **Password Hashing**  
  Password pengguna di-hash menggunakan `bcryptjs` sebelum disimpan di Firestore.

- ✅ **Validasi Input**  
  Menggunakan `express-validator` untuk mencegah input tidak valid, XSS, dan injection.

- 🛡️ **Role-Based Access**  
  Admin dan user memiliki akses endpoint berbeda. Middleware `authMiddleware` memverifikasi token dan peran pengguna.

---

## 🛠️ Instalasi

### 1. Clone Proyek
```bash
git clone https://github.com/RyanArsyad/pet-adoption-platform-api.git
cd pet-adoption-platform-api
```

### 2. Install Dependency
```bash
npm install
```

### 3. Siapkan Firebase
- Buat project di [Firebase Console](https://console.firebase.google.com/)
- Aktifkan Firestore
- Buat service account key dalam format `.json`
- Simpan file dengan nama: `serviceAccountKey.json` di root folder proyek

### 4. Buat file `.env`
```env
PORT=3000
GCP_PROJECT_ID=<project_id>
FIRESTORE_COLLECTION_USERS=users
FIRESTORE_COLLECTION_PETS=pets
FIRESTORE_COLLECTION_ADOPTION_REQESTS=adoption_requests
JWT_SECRET=your_jwt_secret_here
AUTH_ADMIN_SECRET=secretadminkey
```

### 5. Jalankan Server
```bash
node server.js
```

---

## 🔗 API Endpoints

### 📌 Auth
| Method | Endpoint         | Deskripsi                      |
|--------|------------------|-------------------------------|
| POST   | `/auth/register` | Registrasi pengguna baru      |
| POST   | `/auth/login`    | Login dan dapatkan JWT token  |

---

### 🐾 Pets
| Method | Endpoint       | Deskripsi                                |
|--------|----------------|-------------------------------------------|
| GET    | `/pets`        | Melihat semua hewan yang tersedia        |
| POST   | `/pets`        | Menambahkan hewan baru (**admin only**)  |
| PUT    | `/pets/:id`    | Mengedit data hewan (**admin only**)     |
| DELETE | `/pets/:id`    | Menghapus hewan (**admin only**)         |

---

### 📄 Adoptions
| Method | Endpoint                          | Deskripsi                                           |
|--------|-----------------------------------|----------------------------------------------------|
| POST   | `/adoptions`                      | Ajukan permintaan adopsi (user)                   |
| GET    | `/adoptions`                      | Melihat permintaan adopsi milik user              |
| DELETE | `/adoptions/:id`                  | Batalkan permintaan adopsi                        |
| GET    | `/admin/adoptions`                | Lihat semua permintaan adopsi (admin)             |
| PUT    | `/admin/adoptions/:id/status`     | Ubah status: approved, rejected, cancelled (admin) |
