// lib/auth.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

if (!JWT_SECRET) throw new Error('JWT_SECRET must be set');

export function signAdminToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

export function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

export async function validateAdminCredentials(username, password) {
  if (!username || !password) return false;
  if (username !== ADMIN_USERNAME) return false;
  if (ADMIN_PASSWORD_HASH) {
    return await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  } else {
    return password === ADMIN_PASSWORD;
  }
}

// For server handlers: read cookie from Request and verify
export function parseCookie(header, name = 'token') {
  if (!header) return null;
  const pairs = header.split(';').map(p => p.trim());
  for (const p of pairs) {
    if (p.startsWith(name + '=')) return decodeURIComponent(p.split('=').slice(1).join('='));
  }
  return null;
}

export function requireAdminFromRequest(req) {
  // req is Next.js App Router Request: headers accessible with req.headers.get
  const cookieHeader = (req.headers && (req.headers.get ? req.headers.get('cookie') : req.headers.cookie)) || '';
  const token = parseCookie(cookieHeader, 'token');
  if (!token) return null;
  const data = verifyToken(token);
  if (!data || data.role !== 'admin') return null;
  return data;
}
