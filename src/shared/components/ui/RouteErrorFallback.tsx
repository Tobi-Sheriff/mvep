import { useEffect, useState } from 'react';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

const CHUNK_RELOAD_KEY = 'mvep:chunk-reload-attempted';

function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed/i.test(
    message,
  );
}

export function RouteErrorFallback() {
  const error = useRouteError();
  const navigate = useNavigate();
  const chunkLoadError = isChunkLoadError(error);
  const [autoReloading] = useState(chunkLoadError && !sessionStorage.getItem(CHUNK_RELOAD_KEY));

  useEffect(() => {
    if (!autoReloading) return;
    // A missing chunk almost always means the app was rebuilt or the dev
    // server restarted while this tab was open — one reload resolves it.
    sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
    window.location.reload();
  }, [autoReloading]);

  if (autoReloading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">Reloading…</p>
      </div>
    );
  }

  let title = 'Something went wrong';
  let message = error instanceof Error ? error.message : 'An unexpected error occurred.';

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? 'Page not found' : `Error ${error.status}`;
    message = error.statusText || message;
  } else if (chunkLoadError) {
    title = "Couldn't load this page";
    message =
      'This usually happens when the app was updated or the dev server restarted while this tab was open. Reloading should fix it.';
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-8 text-center dark:bg-slate-900">
      <AlertTriangle size={40} className="text-amber-500" aria-hidden="true" />
      <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h1>
      <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">{message}</p>
      <div className="mt-2 flex gap-3">
        <button
          onClick={() => {
            sessionStorage.removeItem(CHUNK_RELOAD_KEY);
            window.location.reload();
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <RefreshCw size={15} aria-hidden="true" />
          Reload page
        </button>
        <button
          onClick={() => navigate('/store')}
          className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Home size={15} aria-hidden="true" />
          Go to storefront
        </button>
      </div>
    </div>
  );
}
