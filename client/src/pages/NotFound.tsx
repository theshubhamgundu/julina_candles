import React from 'react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';

const NotFoundPage: React.FC = () => {
  usePageSEO({
    title: '404 Page Not Found | Julina Candles & Melts',
    description: 'The page you are looking for does not exist or has been moved.',
    noIndex: true,
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h1 className="text-6xl font-bold text-[#185e33] mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="bg-[#185e33] text-white px-6 py-2.5 rounded-lg hover:bg-[#134b28] transition font-medium text-sm inline-block">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;


