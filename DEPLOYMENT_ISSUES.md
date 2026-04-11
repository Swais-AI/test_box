# SWAIS Deployment Issues — swais.in
> Identified on: 2026-04-10

---

## 🔴 ISSUE 1 — Google OAuth redirecting to localhost:3001 after login

### What's happening
After selecting a Google account, users are being sent to:
```
http://localhost:3001/dashboard
```
instead of `https://swais.in/dashboard`

### Root Cause
In `backend/app/routers/auth.py`, after OAuth succeeds the backend reads
`settings.FRONTEND_URL` to build the redirect URL:
```python
redirect_to = f"{frontend}/dashboard"   # line 90
redirect_to = f"{frontend}/register"    # line 86
redirect_to = f"{frontend}/pending"     # line 88
```
On the EC2 server, the `backend/.env` file still has:
```
FRONTEND_URL=http://localhost:3001     ← WRONG
```
This was the local development value (port 3001 was used locally because 3000 was taken).

### Fix (on EC2)
SSH into EC2, open `/path-to-project/backend/.env` and change:
```
FRONTEND_URL=https://swais.in
```
Then restart the backend service:
```bash
sudo systemctl restart swais-backend
```

---

## 🔴 ISSUE 2 — api.swais.in is completely unreachable

### What's happening
`https://api.swais.in` and `https://api.swais.in/health` both return
**ECONNREFUSED** — the backend API cannot be reached from the internet.

### Root Cause (one or more of the following)
- Nginx on EC2 has no server block for the `api.swais.in` subdomain
- DNS: `api.swais.in` A record is missing or not pointing to the EC2 IP
- FastAPI service (`swais-backend`) is not running
- SSL certificate not issued for `api.swais.in`

### Fix Steps (on EC2)

**Step 1 — Check if FastAPI is running:**
```bash
sudo systemctl status swais-backend
sudo journalctl -u swais-backend -n 50   # view logs
sudo systemctl start swais-backend
sudo systemctl enable swais-backend      # auto-start on reboot
```

**Step 2 — Check if port 5000 is listening:**
```bash
sudo ss -tlnp | grep 5000
```

**Step 3 — Add Nginx config for api.swais.in:**
```nginx
server {
    listen 80;
    server_name api.swais.in;

    location / {
        proxy_pass         http://127.0.0.1:5000;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```
Save to `/etc/nginx/sites-available/api.swais.in`, then:
```bash
sudo ln -s /etc/nginx/sites-available/api.swais.in /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Step 4 — Issue SSL certificate for subdomain:**
```bash
sudo certbot --nginx -d api.swais.in
```

**Step 5 — Verify DNS:**
Check that `api.swais.in` has an A record pointing to the same EC2 public IP as `swais.in`.
```bash
nslookup api.swais.in
```

---

## 🟡 ISSUE 3 — Dashboard and /pending stuck on loading

### What's happening
- `/dashboard` shows "Loading session..." and never loads
- `/pending` shows "Checking account status..." and never resolves

### Root Cause
Both pages call the backend API (`/user/me`, `/functions`) to verify the
user's JWT token and load data. Since `api.swais.in` is down (Issue 2),
these calls silently fail and the pages hang in a loading state.

### Fix
Fixing Issue 2 (making `api.swais.in` reachable) will automatically resolve this.

---

## ✅ What Is Working

| Item                          | Status        |
|-------------------------------|---------------|
| `https://swais.in` homepage   | ✅ Loading     |
| `https://swais.in/login`      | ✅ Page loads  |
| Frontend (Next.js on EC2)     | ✅ Running     |
| Favicon / logo                | ✅ Showing     |
| HTTPS on swais.in             | ✅ SSL active  |

---

## Summary — Priority Order

| Priority | Issue                                   | Fix Location        |
|----------|-----------------------------------------|---------------------|
| 🔴 P1    | OAuth redirecting to localhost:3001     | Change `FRONTEND_URL` in `backend/.env` on EC2 |
| 🔴 P1    | `api.swais.in` unreachable              | Nginx config + SSL cert + DNS + start backend service |
| 🟡 P2    | Dashboard/pending stuck loading         | Auto-fixed once P1 above are resolved |

---

## Quick Fix Summary (All commands in one go)

```bash
# 1. Fix FRONTEND_URL
sed -i 's|FRONTEND_URL=.*|FRONTEND_URL=https://swais.in|' /path/to/backend/.env

# 2. Restart backend
sudo systemctl restart swais-backend

# 3. Add Nginx subdomain config (edit file first, then)
sudo nginx -t && sudo systemctl reload nginx

# 4. Issue SSL for subdomain
sudo certbot --nginx -d api.swais.in
```
