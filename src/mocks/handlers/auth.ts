import { http, HttpResponse, delay } from 'msw';
import type { User } from '@/features/auth/types';

type StoredUser = User & { password: string };

// Seeded accounts — admin is the super-admin, pre-verified
const db: StoredUser[] = [
  { id: '1', name: 'Alice Customer', email: 'customer@mvep.dev', password: 'password', role: 'customer' },
  { id: '2', name: 'Bob Vendor', email: 'vendor@mvep.dev', password: 'password', role: 'vendor' },
  { id: '3', name: 'Carol Admin (Super)', email: 'admin@mvep.dev', password: 'password', role: 'admin' },
];

// In-memory verification codes: email → 6-digit code
const verificationCodes = new Map<string, string>();

function toPublicUser(u: StoredUser): User {
  return { id: u.id, name: u.name, email: u.email, role: u.role };
}

export const authHandlers = [
  http.post('/api/v1/auth/login', async ({ request }) => {
    await delay(400);
    const body = await request.json() as { email: string; password: string };
    const found = db.find((u) => u.email === body.email && u.password === body.password);
    if (!found) {
      return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }
    return HttpResponse.json({
      user: toPublicUser(found),
      token: `mock-jwt-${found.id}-${Date.now()}`,
    });
  }),

  http.post('/api/v1/auth/register', async ({ request }) => {
    await delay(600);
    const body = await request.json() as {
      name: string; email: string; password: string; role: string;
    };
    if (db.some((u) => u.email === body.email)) {
      return HttpResponse.json({ message: 'Email already in use' }, { status: 409 });
    }
    const newUser: StoredUser = {
      id: String(db.length + 1),
      name: body.name,
      email: body.email,
      role: body.role as User['role'],
      password: body.password,
    };
    db.push(newUser);

    // Generate and store 6-digit verification code
    const code = String(Math.floor(100000 + Math.random() * 900000));
    verificationCodes.set(newUser.email, code);

    return HttpResponse.json(
      { requiresVerification: true, email: newUser.email, devCode: code },
      { status: 201 },
    );
  }),

  http.post('/api/v1/auth/verify-email', async ({ request }) => {
    await delay(500);
    const { email, code } = await request.json() as { email: string; code: string };
    const stored = verificationCodes.get(email);
    if (!stored || stored !== code) {
      return HttpResponse.json({ message: 'Invalid or expired verification code' }, { status: 400 });
    }
    verificationCodes.delete(email);
    const user = db.find((u) => u.email === email);
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return HttpResponse.json({
      user: toPublicUser(user),
      token: `mock-jwt-${user.id}-${Date.now()}`,
    });
  }),

  http.post('/api/v1/auth/resend-verification', async ({ request }) => {
    await delay(400);
    const { email } = await request.json() as { email: string };
    if (!db.some((u) => u.email === email)) {
      return HttpResponse.json({ message: 'Email not found' }, { status: 404 });
    }
    const newCode = String(Math.floor(100000 + Math.random() * 900000));
    verificationCodes.set(email, newCode);
    return HttpResponse.json({ devCode: newCode });
  }),

  http.post('/api/v1/auth/logout', async () => {
    await delay(200);
    return HttpResponse.json({ message: 'Logged out successfully' });
  }),

  http.get('/api/v1/auth/me', ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth?.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return HttpResponse.json({ user: toPublicUser(db[0]) });
  }),
];
