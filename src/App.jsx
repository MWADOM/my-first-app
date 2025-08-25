import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp, query } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { Leaf, Camera, Recycle, Tag, Home, Compass, PlusCircle, MessageCircle, MapPin } from 'lucide-react';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyC8LY4Q6cJKDg66CKA09M9INuf-dtZmRSg",
  authDomain: "verdant-budget-ft4iy.firebaseapp.com",
  projectId: "verdant-budget-ft4iy",
  storageBucket: "verdant-budget-ft4iy.firebasestorage.app",
  messagingSenderId: "161785516256",
  appId: "1:161785516256:web:e80fe93663f3bd91b04085"
};

// --- Gemini API Configuration ---
const API_KEY = "AIzaSyBWvZQxyRk9-aljr8Bad8Zr_GdMRLR3h4o";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

// --- Reusable Components ---

const MarketplaceItemCard = ({ item }) => (
  <div className="bg-gray-50 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
    <img src={item.imageUrl} alt={item.title} className="w-full sm:w-24 h-24 object-cover rounded-md" />
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
      <div className="flex items-center text-sm text-gray-500 mt-2">
        <MapPin size={16} className="mr-1" />
        <span>{item.location}</span>
      </div>
    </div>
    <div className="flex flex-col items-center">
      <div className="flex items-center text-sm text-white px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: item.statusColor }}>
        <Tag size={12} className="mr-1" />
        {item.status}
      </div>
      <button className="mt-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-semibold hover:bg-emerald-600 transition-all duration-300">
        <MessageCircle size={16} className="inline-block mr-1" />
        Contact
      </button>
    </div>
  </div>
);

const AddListingForm = ({ onAddListing, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && description && location && imageUrl && !isSubmitting) {
      setIsSubmitting(true);
      const newItem = {
        title,
        description,
        imageUrl,
        location,
        status: "Free",
        statusColor: "#4CAF50",
        createdAt: serverTimestamp(),
      };
      await onAddListing(newItem);
      setIsSubmitting(false);
      onCancel();
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add a New Listing</h2>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="e.g., Old Wooden Chair"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="Tell us about the item..."
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="e.g., 2 miles away"
            required
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="e.g., https://placehold.co/400x400"
            required
          />
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 rounded-full border border-gray-300 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 text-sm font-medium text-white rounded-full shadow-md transition-all ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600'}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

const Marketplace = ({ listings, onAddListing }) => {
  const [isAddingListing, setIsAddingListing] = useState(false);

  if (isAddingListing) {
    return <AddListingForm onAddListing={onAddListing} onCancel={() => setIsAddingListing(false)} />;
  }

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center w-full mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Marketplace</h2>
        <button onClick={() => setIsAddingListing(true)} className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-full font-semibold shadow-md hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105">
          <PlusCircle size={16} className="mr-2" />
          Add Listing
        </button>
      </div>
      
      <div className="w-full">
        {listings.length > 0 ? (
          listings.map((item) => (
            <MarketplaceItemCard key={item.id} item={item} />
          ))
        ) : (
          <div className="text-center p-8 text-gray-500 bg-white rounded-lg shadow-inner">
            <p>No listings found. Be the first to add an item!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const UploadModal = ({ onFileSelect, onScan, onCancel, selectedFile, loading }) => {
  const fileInputRef = useRef(null);

  const handleChooseImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Image</h2>
        <p className="text-gray-600 mb-6">Select an image of the item you want to sort.</p>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileSelect} 
          accept="image/*"
          className="hidden"
        />

        {selectedFile ? (
          <div className="w-full flex flex-col items-center">
            <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-48 h-48 object-cover rounded-lg mb-4 shadow-md"/>
            <button
              onClick={onScan}
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 bg-emerald-500 text-white rounded-full font-semibold shadow-md hover:bg-emerald-600 transition-all"
            >
              {loading ? 'Scanning...' : 'Scan Now'}
            </button>
          </div>
        ) : (
          <button
            onClick={handleChooseImageClick}
            className="w-full flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-semibold shadow-md hover:bg-gray-300 transition-all"
          >
            <PlusCircle size={20} className="mr-2" />
            Choose an Image
          </button>
        )}
        <button onClick={onCancel} className="mt-4 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
      </div>
    </div>
  );
};

const HomePage = ({ onSnapClick }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg w-full max-w-sm text-center">
    <div className="p-6 bg-emerald-100 rounded-full mb-6 shadow-inner">
      <Leaf className="text-emerald-500" size={64} />
    </div>
    <h1 className="text-3xl font-bold text-gray-800 mb-2">The Loop</h1>
    <p className="text-gray-600 mb-8">Scan items to learn how to recycle and earn Eco Points!</p>
    
    <button
      onClick={onSnapClick}
      className="flex items-center justify-center px-6 py-3 bg-emerald-500 text-white rounded-full font-semibold shadow-md hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105"
    >
      <Camera className="mr-2" size={20} />
      Snap & Sort
    </button>
  </div>
);

const ResultPage = ({ lastScannedItem, onBackClick }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg w-full max-w-md text-center">
    <div className="p-6 bg-emerald-100 rounded-full mb-6 shadow-inner">
      {lastScannedItem.icon}
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-2">{lastScannedItem.name}</h2>
    <p className="text-lg font-medium mb-4" style={{ color: lastScannedItem.color }}>{lastScannedItem.action}</p>
    <p className="text-gray-600 mb-6">You earned <span className="font-bold text-emerald-500">{lastScannedItem.points}</span> Eco Points!</p>
    <button
      onClick={onBackClick}
      className="flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-semibold shadow-md hover:bg-gray-300 transition-all"
    >
      Scan Another Item
    </button>
  </div>
);

// --- Main App Component ---
const App = () => {
  const [ecoPoints, setEcoPoints] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Ready to scan an item!");
  const [lastScannedItem, setLastScannedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [marketplaceListings, setMarketplaceListings] = useState([]);
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const auth = getAuth(app);
      setDb(firestore);

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          try {
            await signInAnonymously(auth);
          } catch (error) {
            console.error("Anonymous sign-in error:", error);
          }
        }
      });
    } catch (error) {
      console.error("Firebase Init Error:", error);
    }
  }, []);

  useEffect(() => {
    if (!db) return;
    const listingsRef = collection(db, "marketplace_listings");
    const q = query(listingsRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      listings.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setMarketplaceListings(listings);
    }, (error) => console.error("Firestore listener error:", error));
    return () => unsubscribe();
  }, [db]);

  const handleAddListing = async (newListing) => {
    if (!db) return;
    try {
      await addDoc(collection(db, "marketplace_listings"), newListing);
      setStatusMessage("Listing added!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setStatusMessage("Please select an image first.");
      return;
    }
    setIsScanning(true);
    setStatusMessage("Analyzing image...");

    try {
      const imagePart = await fileToGenerativePart(selectedFile);
      const prompt = "Analyze the item in this image. Is it recyclable, compostable, or neither? Provide a one-sentence instruction for how to dispose of it. Be specific about the item and its disposal method.";
      
      const payload = {
        contents: [{ parts: [{ text: prompt }, imagePart] }],
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (textResponse) {
        let disposition = "Recycle";
        let disposalColor = "blue";
        let points = 10;
        let icon = <Recycle className="text-blue-500" size={36} />;

        if (textResponse.toLowerCase().includes("compost")) {
          disposition = "Compost";
          disposalColor = "#8BC34A";
          points = 8;
          icon = <Leaf className="text-lime-500" size={36} />;
        } else if (textResponse.toLowerCase().includes("landfill") || textResponse.toLowerCase().includes("neither")) {
          disposition = "Neither";
          disposalColor = "gray";
          points = 0;
          icon = <Tag className="text-gray-500" size={36} />;
        }
        
        setLastScannedItem({
          name: "Scanned Item",
          action: textResponse,
          color: disposalColor,
          points: points,
          icon: icon,
        });
        setEcoPoints(prev => prev + points);
        setStatusMessage("Scan complete!");
        setCurrentPage('result');
        setShowUploadModal(false);
        setSelectedFile(null);
      } else {
        setStatusMessage("Could not identify the item. Please try another image.");
      }
    } catch (e) {
      console.error("Scan Error:", e);
      setStatusMessage("Error during scanning. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileSelected = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const openUploadModal = () => setShowUploadModal(true);
  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'result':
        return <ResultPage lastScannedItem={lastScannedItem} onBackClick={() => setCurrentPage('home')} />;
      case 'marketplace':
        return <Marketplace listings={marketplaceListings} onAddListing={handleAddListing} />;
      case 'home':
      default:
        return <HomePage onSnapClick={openUploadModal} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 flex flex-col items-center justify-center p-4 antialiased">
      <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-2 shadow-sm flex items-center">
        <span className="font-bold text-lg text-emerald-500">{ecoPoints}</span>
        <span className="ml-1 text-sm text-gray-500">Eco Points</span>
      </div>
      
      {showUploadModal && (
        <UploadModal 
          onFileSelect={handleFileSelected}
          onScan={handleScan}
          onCancel={closeUploadModal}
          selectedFile={selectedFile}
          loading={isScanning}
        />
      )}

      <div className="flex-grow flex items-center justify-center w-full">
        {renderContent()}
      </div>
      
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg rounded-t-xl py-4 px-8 flex justify-around">
        <button
          onClick={() => setCurrentPage('home')}
          className={`flex flex-col items-center text-sm font-medium transition-colors duration-200 ${currentPage === 'home' ? 'text-emerald-500' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Home size={24} className="mb-1" />
          Home
        </button>
        <button
          onClick={() => setCurrentPage('marketplace')}
          className={`flex flex-col items-center text-sm font-medium transition-colors duration-200 ${currentPage === 'marketplace' ? 'text-emerald-500' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Compass size={24} className="mb-1" />
          Marketplace
        </button>
      </div>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-md">
        <p className="text-sm text-gray-600 font-medium">{statusMessage}</p>
      </div>
    </div>
  );
};

export default App;
