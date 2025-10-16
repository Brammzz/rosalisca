# 🔧 Environment Variables untuk Vercel Backend Deployment

## Environment Variables yang WAJIB di-set di Vercel Dashboard:

### 1. Database Configuration

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rosalisca?retryWrites=true&w=majority
```

**Replace dengan:**

- `username`: MongoDB Atlas username Anda
- `password`: MongoDB Atlas password Anda
- `cluster`: Nama cluster MongoDB Atlas Anda

### 2. JWT Secret

```
JWT_SECRET=rosalisca_super_secret_jwt_key_2025_very_long_and_secure_string_for_production
```

### 3. Node Environment

```
NODE_ENV=production
```

### 4. Frontend URL (untuk CORS)

```
FRONTEND_URL=https://rosalisca.vercel.app
```

## Cara Set Environment Variables di Vercel:

1. **Login ke Vercel Dashboard**: https://vercel.com/dashboard
2. **Pilih project backend**: `rosalisca-backend`
3. **Masuk ke Settings → Environment Variables**
4. **Add each variable:**

   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://your_username:your_password@your_cluster.mongodb.net/rosalisca`
   - Environment: `Production`, `Preview`, `Development`

   - Name: `JWT_SECRET`
   - Value: `rosalisca_super_secret_jwt_key_2025_very_long_and_secure_string_for_production`
   - Environment: `Production`, `Preview`, `Development`

   - Name: `NODE_ENV`
   - Value: `production`
   - Environment: `Production`

   - Name: `FRONTEND_URL`
   - Value: `https://rosalisca.vercel.app`
   - Environment: `Production`, `Preview`, `Development`

5. **Save changes**
6. **Redeploy project** (trigger new deployment)

## Test Environment Variables:

Setelah set environment variables, test dengan:

```
https://rosalisca-backend.vercel.app/api/test
```

## Jika Masih Error:

1. **Check MongoDB Atlas IP Whitelist:**

   - Pastikan `0.0.0.0/0` sudah di-whitelist
   - Atau tambahkan Vercel IP ranges

2. **Check Database Connection:**

   - Test connection string di MongoDB Compass

3. **Check Vercel Function Logs:**
   - Dashboard → Functions → View Logs

## Default Admin Credentials:

```
Email: admin@gmail.com
Password: admin123
```

**Admin user akan otomatis dibuat saat pertama kali API diakses.**
