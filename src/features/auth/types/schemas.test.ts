import { loginSchema, registerSchema } from '@/features/auth/types/schemas';

describe('loginSchema', () => {
  it('accepts a valid email and password', () => {
    expect(loginSchema.safeParse({ email: 'user@example.com', password: 'password' }).success).toBe(true);
  });

  it('rejects an invalid email format', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'password' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Enter a valid email address');
  });

  it('rejects a password shorter than 6 characters', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'abc' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Password must be at least 6 characters');
  });

  it('rejects an empty email', () => {
    expect(loginSchema.safeParse({ email: '', password: 'password' }).success).toBe(false);
  });

  it('rejects a missing password', () => {
    expect(loginSchema.safeParse({ email: 'user@example.com' }).success).toBe(false);
  });
});

describe('registerSchema', () => {
  const valid = {
    name: 'John Smith',
    email: 'john@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    role: 'customer' as const,
  };

  it('accepts valid registration data', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts vendor role', () => {
    expect(registerSchema.safeParse({ ...valid, role: 'vendor' }).success).toBe(true);
  });

  it('rejects a name shorter than 2 characters', () => {
    const result = registerSchema.safeParse({ ...valid, name: 'J' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Name must be at least 2 characters');
  });

  it('rejects an invalid email format', () => {
    expect(registerSchema.safeParse({ ...valid, email: 'not-email' }).success).toBe(false);
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: 'different123' });
    expect(result.success).toBe(false);
    const issue = result.error?.issues.find((i) => i.path.includes('confirmPassword'));
    expect(issue?.message).toBe("Passwords don't match");
  });

  it('rejects an unsupported role', () => {
    expect(registerSchema.safeParse({ ...valid, role: 'superuser' }).success).toBe(false);
  });

  it('rejects a password shorter than 6 characters', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'abc', confirmPassword: 'abc' });
    expect(result.success).toBe(false);
  });
});
