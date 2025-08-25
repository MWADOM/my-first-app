import React from 'react';

const EcoScore = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Eco-Score</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <p className="text-lg">Your Score</p>
          <p className="text-5xl font-bold text-green-500">85</p>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Recommendations</h3>
          <ul className="list-disc list-inside">
            <li>Try a reusable coffee mug this week!</li>
            <li>Look for products with less packaging.</li>
            <li>You're doing great with plastics!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EcoScore;
