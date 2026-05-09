# Environment Variables Setup

## Next.js Frontend (.env.local)

Create `.env.local` in the root directory:

```bash
# Backend API URL (FastAPI)
BACKEND_API_URL=http://localhost:5000

# For production:
# BACKEND_API_URL=https://api.yourdomain.com
```

**Note:** `DATABASE_URL` is NO LONGER NEEDED in Next.js since all database operations now go through FastAPI.

---

## FastAPI Backend (.env)

Your FastAPI backend should have:

```bash
# Database Connection
DATABASE_URL=postgresql://username:password@host:5432/dbname?sslmode=require

# JWT Secret
JWT_SECRET=your-strong-random-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001

# For production:
# FRONTEND_URL=https://yourdomain.com

# Environment
NODE_ENV=development
```

---

## Production Environment Variables

### Next.js (Vercel/AWS/etc.)

```bash
BACKEND_API_URL=https://api.yourdomain.com
```

### FastAPI (EC2/Docker/etc.)

```bash
DATABASE_URL=postgresql://username:password@your-rds-endpoint.amazonaws.com:5432/dbname?sslmode=require
JWT_SECRET=<generate-new-secret-for-production>
GOOGLE_CLIENT_ID=<production-google-client-id>
GOOGLE_CLIENT_SECRET=<production-google-client-secret>
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production
```

---

## Database Connection Pool Settings

Since only FastAPI connects to the database now, configure connection pooling there:

**Python (psycopg2):**
```python
pool = psycopg2.pool.SimpleConnectionPool(
    minconn=2,
    maxconn=10,  # Adjust based on your RDS instance
    dsn=DATABASE_URL
)
```

**Or with SQLAlchemy:**
```python
engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=5,
    pool_pre_ping=True
)
```

---

## Security Checklist

- [ ] Never commit `.env` or `.env.local` files
- [ ] Use different `JWT_SECRET` for production
- [ ] Use separate Google OAuth credentials for production
- [ ] Enable SSL for production database connections (`sslmode=require`)
- [ ] Restrict CORS to production domain only
- [ ] Use environment-specific API URLs (no localhost in production)

---

## Testing Configuration

**Local Development:**
1. Start FastAPI backend: `uvicorn main:app --reload --port 5000`
2. Start Next.js frontend: `npm run dev` (runs on port 3001)
3. Verify `BACKEND_API_URL=http://localhost:5000` in `.env.local`

**Production:**
1. Deploy FastAPI to your server/container
2. Deploy Next.js to Vercel/AWS/etc.
3. Update `BACKEND_API_URL` to production FastAPI URL
4. Update `FRONTEND_URL` in FastAPI to production Next.js URL
