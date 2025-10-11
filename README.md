# PT. Rosa Lisca Group - Corporate Website

Sebuah aplikasi web full-stack untuk PT. Rosa Lisca Group yang menampilkan profil perusahaan, manajemen proyek, sistem karir, dan portal administrasi.

## 📋 Deskripsi Proyek

PT. Rosa Lisca Group adalah perusahaan konstruksi yang bergerak di bidang General Contractor, Civil Engineering, Supplier, Microtunnelling, dan Sistem Drainase. Website ini dikembangkan untuk meningkatkan presence digital perusahaan dan menyediakan platform manajemen internal yang komprehensif.

## 🚀 Fitur Utama

### Frontend (Website Publik)

- **Beranda**: Hero section dengan informasi perusahaan
- **Tentang Kami**: Profil perusahaan dan sejarah
- **Proyek**: Showcase proyek-proyek konstruksi
- **Unit Bisnis**: Informasi anak perusahaan (Jhon Ro, Gunung Sahid, Arimada Persada)
- **Klien**: Daftar klien dan testimoni
- **Karir**: Portal lowongan kerja dan aplikasi online
- **Kontak**: Formulir kontak dan informasi perusahaan
- **Sertifikat**: Galeri sertifikat dan penghargaan

### Backend (Admin Panel)

- **Dashboard**: Overview statistik dan aktivitas
- **Manajemen Proyek**: CRUD proyek dengan upload gambar
- **Manajemen Klien**: Database klien dengan kategori
- **Manajemen Kontak**: Sistem ticketing untuk inquiry
- **Manajemen Karir**: Posting lowongan dan review aplikasi
- **Manajemen Sertifikat**: Upload dan kategorisasi sertifikat
- **Manajemen Perusahaan**: Profil anak perusahaan
- **Sistem Aplikasi**: Review CV, jadwal interview, status tracking

## 🛠 Teknologi

### Frontend

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI + Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: Sonner

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB dengan Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Security**: bcryptjs untuk password hashing
- **CORS**: Enabled untuk cross-origin requests

### Development Tools

- **Process Manager**: Nodemon (development)
- **Package Manager**: npm
- **Version Control**: Git
- **Environment**: dotenv untuk environment variables

## 📁 Struktur Proyek

```
rosalisca/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Authentication & upload
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   └── seeders/        # Database seeders
│   ├── uploads/            # File storage
│   └── server.js           # Entry point
│
├── frontend/               # React/TypeScript SPA
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Route components
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utilities
│   └── public/             # Static assets
```

## 🚀 Instalasi dan Setup

### Prasyarat

- Node.js (v16 atau lebih tinggi)
- MongoDB (local atau cloud)
- Git

### Clone Repository

```bash
git clone <repository-url>
cd rosalisca
```

### Setup Backend

```bash
cd backend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan konfigurasi database dan JWT secret

# Jalankan server development
npm run dev
```

### Setup Frontend

```bash
cd frontend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan URL API backend

# Jalankan development server
npm run dev
```

## 🔧 Konfigurasi Environment

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rosalisca
JWT_SECRET=your_jwt_secret_here
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 Endpoint API

### Authentication

- `POST /api/auth/login` - Admin login

### Projects

- `GET /api/projects` - Get all projects (public)
- `POST /api/projects` - Create project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)

### Clients

- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create client (admin)
- `GET /api/clients/stats` - Get client statistics

### Careers

- `GET /api/careers/public/careers` - Get public careers
- `POST /api/careers/public/careers/:id/apply` - Submit application
- `GET /api/careers/admin/careers` - Get all careers (admin)
- `POST /api/careers/admin/careers` - Create career (admin)

### Contacts

- `POST /api/contacts` - Submit contact form (public)
- `GET /api/contacts` - Get all contacts (admin)
- `PUT /api/contacts/:id/status` - Update contact status (admin)

### Certificates

- `GET /api/certificates` - Get all certificates
- `POST /api/certificates` - Create certificate (admin)

### Companies

- `GET /api/companies` - Get all companies
- `GET /api/companies/parent` - Get parent company info
- `GET /api/companies/subsidiaries` - Get subsidiaries

## 👥 Roles dan Permissions

### Admin

- Full access ke semua fitur
- Dapat membuat, edit, dan hapus semua konten
- Akses dashboard dan analytics

### Public Users

- Browse proyek dan konten publik
- Submit aplikasi kerja
- Gunakan formulir kontak

## 📊 Fitur Admin Dashboard

1. **Overview Dashboard**

   - Total proyek, klien, kontak, aplikasi
   - Statistik penjualan dan performa
   - Recent activities

2. **Project Management**

   - Upload gambar proyek (main + gallery)
   - Kategorisasi proyek
   - Status tracking
   - Client assignment

3. **Career Management**

   - Job posting dengan rich editor
   - Application tracking system
   - Interview scheduling
   - Document management (CV, portfolio)

4. **Contact Management**

   - Inquiry categorization
   - Priority levels
   - Response tracking
   - Notes system

5. **Client Management**
   - Client database dengan kategorisasi
   - Project count tracking
   - Satisfaction ratings
   - Contact information

## 🔐 Security Features

- JWT-based authentication
- Password hashing dengan bcryptjs
- File upload validation dan sanitization
- CORS protection
- Input validation dan sanitization
- Protected admin routes

## 📱 Responsive Design

Website fully responsive dengan support untuk:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Backend Deployment

1. Setup production MongoDB
2. Configure environment variables
3. Build dan deploy ke hosting (Heroku, DigitalOcean, etc.)

### Frontend Deployment

1. Build production: `npm run build`
2. Deploy dist folder ke hosting (Netlify, Vercel, etc.)
3. Configure API URL untuk production

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
```

### Frontend Testing

```bash
cd frontend
npm run test
```

## 📈 Performance Optimization

- Image compression dan lazy loading
- API response caching
- Database indexing
- Code splitting (React)
- Bundle optimization (Vite)

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/nama-fitur`
3. Commit changes: `git commit -m 'Add nama fitur'`
4. Push to branch: `git push origin feature/nama-fitur`
5. Submit pull request

## 📝 Changelog

### v1.0.0 (Current)

- Initial release
- Complete frontend dan backend implementation
- Admin dashboard dengan full CRUD operations
- Public website dengan responsive design
- Career application system
- Contact management system

## 📄 License

Copyright © 2025 PT. Rosa Lisca Group. All rights reserved.

---
