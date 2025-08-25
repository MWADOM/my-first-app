import React, { useState } from 'react';
import { Camera, Recycle } from 'lucide-react';

const App = () => {
  const [page, setPage] = useState('home');
  const [loading, setLoading] = useState(false);

  const handleSnap = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPage('result');
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-8 text-center bg-white rounded-lg shadow-lg">
        {page === 'home' && (
          <div>
            <h1 className="text-4xl font-bold text-gray-800">The Loop</h1>
            <p className="mt-2 text-lg text-gray-600">Recycle with confidence</p>
            <button
              onClick={handleSnap}
              className="flex items-center justify-center w-full px-6 py-4 mt-8 text-xl font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? (
                'Loading...'
              ) : (
                <>
                  <Camera className="w-8 h-8 mr-4" />
                  Snap & Sort
                </>
              )}
            </button>
          </div>
        )}

        {page === 'result' && (
          <div>
            <Recycle className="w-24 h-24 mx-auto text-green-500" />
            <h2 className="mt-6 text-2xl font-bold text-gray-800">Plastic Water Bottle</h2>
            <p className="mt-2 text-xl text-gray-600">Recycle in the Blue Bin</p>
            <button
              onClick={() => setPage('home')}
              className="w-full px-6 py-3 mt-8 text-lg font-semibold text-white bg-gray-600 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
