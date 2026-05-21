import { cn } from '@/shared/utils/cn';

describe('cn', () => {
  it('merges multiple class strings into one', () => {
    expect(cn('flex', 'items-center', 'gap-2')).toBe('flex items-center gap-2');
  });

  it('excludes falsy conditional classes', () => {
    const active = false;
    expect(cn('base', active && 'active', 'end')).toBe('base end');
  });

  it('resolves conflicting Tailwind utilities — last one wins', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('ignores empty strings', () => {
    expect(cn('flex', '', 'gap-2')).toBe('flex gap-2');
  });

  it('handles undefined and null values without throwing', () => {
    expect(cn('flex', undefined, null as never, 'gap-4')).toBe('flex gap-4');
  });
});
