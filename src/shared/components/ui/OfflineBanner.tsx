import { WifiOff } from 'lucide-react';
import { useAppSelector } from '@/app/hooks';

export function OfflineBanner() {
  const apiUnreachable = useAppSelector((state) => state.connectivity.apiUnreachable);

  if (!apiUnreachable) return null;

  return (
    <div
      role="alert"
      className="flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-center text-sm font-medium text-white"
    >
      <WifiOff size={16} aria-hidden="true" />
      Can&apos;t reach the server. Check that the backend and database are running, then try again.
    </div>
  );
}
