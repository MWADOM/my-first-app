import React from 'react';

const Marketplace = ({ listings = [], onAddListingClick }) => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Marketplace</h2>
        <button 
          onClick={onAddListingClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Listing
        </button>
      </div>
      <div>
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <div key={listing.id} className="border rounded-lg p-4 shadow-lg">
                <img src={listing.imageUrl} alt={listing.title} className="w-full h-32 object-cover rounded-md mb-4" />
                <h3 className="font-bold text-lg">{listing.title}</h3>
                <p>{listing.description}</p>
                <p className="font-semibold">{listing.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No listings found.</p>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
