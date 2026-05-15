import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-8">
      <p className="text-7xl font-black text-gray-200">404</p>
      <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
      <Link to="/store" className="text-sm text-blue-600 underline underline-offset-2">
        Back to store
      </Link>
    </main>
  );
}
