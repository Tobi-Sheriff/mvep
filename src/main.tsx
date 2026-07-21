import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from './app/store';
import { router } from './app/router';
import { ErrorBoundary } from '@/shared/components/ui/ErrorBoundary';
import { PageSkeleton } from '@/shared/components/ui/PageSkeleton';
import { OfflineBanner } from '@/shared/components/ui/OfflineBanner';
import './index.css';

async function enableMocking() {
  if (import.meta.env.VITE_USE_MSW === 'true') {
    const { worker } = await import('./mocks/browser');
    return worker.start({ onUnhandledRequest: 'bypass' });
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <OfflineBanner />
          <Suspense fallback={<PageSkeleton />}>
            <RouterProvider router={router} />
          </Suspense>
        </Provider>
      </ErrorBoundary>
    </StrictMode>,
  );
});
