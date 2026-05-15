import { http, HttpResponse, delay } from 'msw';
import type { User } from '@/features/auth/types';

type StoredUser = User & { password: string };

const db: StoredUser[] = [
  { id: '1', name: 'Alice Customer', email: 'customer@mvep.dev', password: 'password', role: 'customer' },
  { id: '2', name: 'Bob Vendor', email: 'vendor@mvep.dev', password: 'password', role: 'vendor' },
  { id: '3', name: 'Carol Admin', email: 'admin@mvep.dev', password: 'password', role: 'admin' },
];

export const authHandlers = [
  http.post('/api/v1/auth/login', async ({ request }) => {
    await delay(400);
    const body = await request.json() as { email: string; password: string };
    const found = db.find((u) => u.email === body.email && u.password === body.password);
    if (!found) {
      return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }
    const user: User = { id: found.id, name: found.name, email: found.email, role: found.role };
    return HttpResponse.json({ user, token: `mock-jwt-${user.id}-${Date.now()}` });
  }),

  http.post('/api/v1/auth/register', async ({ request }) => {
    await delay(600);
    const body = await request.json() as { name: string; email: string; password: string; role: string };
    if (db.some((u) => u.email === body.email)) {
      return HttpResponse.json({ message: 'Email already in use' }, { status: 409 });
    }
    const newUser: User = {
      id: String(db.length + 1),
      name: body.name,
      email: body.email,
      role: body.role as User['role'],
    };
    db.push({ ...newUser, password: body.password });
    return HttpResponse.json(
      { user: newUser, token: `mock-jwt-${newUser.id}-${Date.now()}` },
      { status: 201 },
    );
  }),

  http.post('/api/v1/auth/logout', async () => {
    await delay(200);
    return HttpResponse.json({ message: 'Logged out successfully' });
  }),
];
