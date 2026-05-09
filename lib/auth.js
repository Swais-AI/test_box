import jwt from 'jsonwebtoken';
import pool from './db';

const JWT_SECRET = process.env.JWT_SECRET;

const SUPER_ADMIN_ROLES = new Set(['SUPER_ADMIN', 'HEAD']);

export async function getUserFromRequest(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }

  const result = await pool.query(
    'SELECT user_id, login_id AS email, full_name AS name, role, is_active, registration_complete FROM users_master WHERE user_id = $1',
    [payload.id]
  );
  return result.rows[0] || null;
}

export async function requireSuperAdmin(request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return { user: null, error: 'Authentication required', status: 401 };
  }
  if (!SUPER_ADMIN_ROLES.has(user.role)) {
    return { user, error: 'Super Admin access required', status: 403 };
  }
  return { user, error: null, status: 200 };
}
