import React, { useState } from 'react';
import { Camera, Recycle, Compass, Home, Leaf } from 'lucide-react';
import Marketplace from './Marketplace';
import AddListingForm from './AddListingForm';
import EcoScore from './EcoScore';

const App = () => {
  const [page, setPage] = useState('home'); // home, result, marketplace, ecoscore
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [listings, setListings] = useState([
    { id: 1, title: 'Recycled Glass Jars', description: 'Set of 5 beautifully recycled glass jars.', price: '$10', imageUrl: 'https://via.placeholder.com/150' },
    { id: 2, title: 'Upcycled Wooden Shelf', description: 'A stylish shelf made from reclaimed wood.', price: '$45', imageUrl: 'https://via.placeholder.com/150' },
  ]);

  const handleSnap = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPage('result');
    }, 1500);
  };

  const handleAddListing = (newListing) => {
    setListings([...listings, { ...newListing, id: listings.length + 1 }]);
    setShowAddForm(false);
  };

  const renderPage = () => {
    switch (page) {
      case 'home':
        return (
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
        );
      case 'result':
        return (
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
        );
      case 'marketplace':
        return <Marketplace listings={listings} onAddListingClick={() => setShowAddForm(true)} />;
      case 'ecoscore':
        return <EcoScore />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-sm p-8 space-y-8 text-center bg-white rounded-lg shadow-lg">
          {renderPage()}
        </div>
      </main>

      {showAddForm && (
        <AddListingForm
          onAddListing={handleAddListing}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <nav className="w-full bg-white shadow-md">
        <div className="flex justify-around max-w-sm mx-auto p-2">
          <button onClick={() => setPage('home')} className={`flex flex-col items-center text-gray-600 hover:text-blue-600 ${page === 'home' || page === 'result' ? 'text-blue-600' : ''}`}>
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button onClick={() => setPage('ecoscore')} className={`flex flex-col items-center text-gray-600 hover:text-blue-600 ${page === 'ecoscore' ? 'text-blue-600' : ''}`}>
            <Leaf className="w-6 h-6" />
            <span className="text-xs">Eco-Score</span>
          </button>
          <button onClick={() => setPage('marketplace')} className={`flex flex-col items-center text-gray-600 hover:text-blue-600 ${page === 'marketplace' ? 'text-blue-600' : ''}`}>
            <Compass className="w-6 h-6" />
            <span className="text-xs">Marketplace</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
