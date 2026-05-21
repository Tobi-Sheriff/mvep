import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/shared/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('does not update the value before the delay elapses', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });
    rerender({ value: 'b' });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe('a');
  });

  it('returns the updated value after the delay elapses', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });
    rerender({ value: 'b' });
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe('b');
  });

  it('respects a custom delay value', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'x' },
    });
    rerender({ value: 'y' });
    act(() => vi.advanceTimersByTime(499));
    expect(result.current).toBe('x');
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('y');
  });
});
