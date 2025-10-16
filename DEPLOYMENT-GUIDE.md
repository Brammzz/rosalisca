# 🚀 Panduan Deployment ke Vercel

## Persiapan Sebelum Deployment

### 1. Setup MongoDB Atl      'https://rosalisca.vercel.app', // URL frontend Vercel Andas (Database Production)

1. **Buat akun di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**
2. **Buat cluster baru:**
   - Pilih provider: AWS/GCP/Azure
   - Region: Singapore/Tokyo (terdekat)
   - Tier: M0 (Free tier untuk testing)
3. **Setup Database User:**
   - Database Access → Add New User
   - Username & Password (simpan dengan aman)
4. **Setup Network Access:**
   - Network Access → Add IP Address
   - Pilih "Allow Access from Anywhere" (0.0.0.0/0) untuk production
5. **Dapatkan Connection String:**
   - Connect → Connect your application
   - Copy connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/rosalisca`

### 2. Persiapan Repository

```bash
# Pastikan semua perubahan sudah di-commit
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Deployment Backend ke Vercel

### 1. Deploy Backend

1. **Login ke [Vercel](https://vercel.com)**
2. **Import Project:**
   - "Add New..." → "Project"
   - Import dari GitHub repository
   - Pilih folder `backend`
3. **Configure Project:**
   - Project Name: `rosalisca-backend`
   - Framework Preset: "Other"
   - Root Directory: `backend`
   - Build Command: (leave empty for Express.js)
   - Output Directory: (leave empty for Express.js)
   - Install Command: `npm install`
4. **Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rosalisca
   JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here
   FRONTEND_URL=https://rosalisca.vercel.app
   ```
5. **Deploy!**

### 2. Dapatkan Backend URL

Setelah deployment berhasil, Anda akan mendapat URL seperti:

```
https://rosalisca-backend.vercel.app
```

## Deployment Frontend ke Vercel

### 1. Update Environment Production

Edit file `frontend/.env.production`:

```bash
VITE_API_URL=https://rosalisca-backend.vercel.app/api
```

### 2. Deploy Frontend

1. **Import Project lagi:**
   - "Add New..." → "Project"
   - Import dari GitHub repository yang sama
   - Pilih folder `frontend`
2. **Configure Project:**
   - Project Name: `rosalisca-frontend`
   - Framework Preset: "Vite"
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. **Environment Variables:**
   ```
   VITE_API_URL=https://rosalisca-backend.vercel.app/api
   ```
4. **Deploy!**

### 3. Update CORS Configuration

Setelah frontend di-deploy, update `backend/server.js` dengan URL frontend yang baru:

```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://rosalisca-frontend.vercel.app", // URL frontend Vercel Anda
      "https://rosalisca.com", // Jika punya custom domain
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  // ... rest of config
};
```

Kemudian redeploy backend:

```bash
git add .
git commit -m "Update CORS for production frontend URL"
git push origin main
```

## Custom Domain (Opsional)

### 1. Setup Custom Domain untuk Frontend

1. **Di Vercel Dashboard:**
   - Pilih project frontend
   - Settings → Domains
   - Add domain: `rosalisca.com` dan `www.rosalisca.com`
2. **Update DNS di domain provider:**
   - A record: `76.76.19.61` (Vercel IP)
   - CNAME: `cname.vercel-dns.com`

### 2. Setup Custom Domain untuk Backend

1. **Add subdomain untuk API:**
   - Add domain: `api.rosalisca.com`
2. **Update frontend environment:**
   ```bash
   VITE_API_URL=https://api.rosalisca.com/api
   ```

## Troubleshooting

### 1. Backend Issues

**Error: "Cannot connect to database"**

- ✅ Periksa MongoDB Atlas connection string
- ✅ Pastikan IP whitelist di MongoDB Atlas
- ✅ Periksa username/password database

**Error: "JWT token invalid"**

- ✅ Pastikan JWT_SECRET sudah di-set di Vercel
- ✅ Periksa format environment variables

### 2. Frontend Issues

**Error: "Network Error" / API calls failing**

- ✅ Pastikan VITE_API_URL sudah benar
- ✅ Periksa CORS configuration di backend
- ✅ Test API endpoint secara manual

**Error: "404 on page refresh"**

- ✅ Sudah ada `vercel.json` dengan SPA routing config
- ✅ Pastikan build berhasil

### 3. CORS Issues

**Error: "Blocked by CORS policy"**

- ✅ Update allowedOrigins di `server.js`
- ✅ Pastikan frontend URL sudah di-whitelist
- ✅ Redeploy backend setelah update CORS

## Monitoring & Maintenance

### 1. Vercel Dashboard

- **Functions:** Monitor API performance
- **Analytics:** Track website usage
- **Deployments:** Lihat history deployment

### 2. Database Monitoring

- **MongoDB Atlas:** Monitor database usage
- **Connection Logs:** Track database connections
- **Performance:** Monitor query performance

### 3. Environment Updates

**Update Backend:**

```bash
git add .
git commit -m "Update backend features"
git push origin main
# Auto-deploy oleh Vercel
```

**Update Frontend:**

```bash
git add .
git commit -m "Update frontend features"
git push origin main
# Auto-deploy oleh Vercel
```

## Security Checklist

- ✅ JWT_SECRET menggunakan string yang kuat (min 32 karakter)
- ✅ MongoDB Atlas IP whitelist dikonfigurasi dengan benar
- ✅ CORS hanya mengizinkan origin yang valid
- ✅ Environment variables tidak di-commit ke Git
- ✅ HTTPS enforce di production
- ✅ File upload validation di backend

## Backup Strategy

### 1. Database Backup

**MongoDB Atlas automatic backup:**

- Backup otomatis setiap hari
- Point-in-time recovery tersedia
- Manual backup sebelum update besar

### 2. Code Backup

**Git repository:**

- Push ke GitHub secara teratur
- Tag release version
- Branching strategy untuk development

---

## 📞 Support

Jika mengalami kesulitan deployment:

1. **Check Vercel Logs:**
   - Vercel Dashboard → Functions → View Logs
2. **Check MongoDB Atlas Logs:**
   - Atlas Dashboard → Monitoring
3. **Check GitHub Issues:**
   - Repository issues untuk bug reports

**Kontak Developer:**

- Email: development@rosalisca.com
- GitHub Issues: [Repository Issues](https://github.com/Brammzz/rosalisca/issues)

---

**Happy Deployment! 🚀**
