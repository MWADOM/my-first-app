import React from 'react';

const Marketplace = ({ listings = [], onAddListingClick }) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <button
          onClick={onAddListingClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Listing
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={listing.imageUrl || 'https://via.placeholder.com/300'} alt={listing.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
                <p className="text-gray-600 mb-4">{listing.description}</p>
                <div className="text-lg font-bold text-blue-600">{listing.price}</div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No listings available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
