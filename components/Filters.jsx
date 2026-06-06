import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Filters = ({ onFilter }) => {
  const [location, setLocation] = useState('');
  const [minFees, setMinFees] = useState('');
  const [maxFees, setMaxFees] = useState('');
  const [rating, setRating] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilters = () => {
    onFilter({
      location: location || undefined,
      minFees: minFees || undefined,
      maxFees: maxFees || undefined,
      rating: rating || undefined
    });
  };

  const handleReset = () => {
    setLocation('');
    setMinFees('');
    setMaxFees('');
    setRating('');
    onFilter({});
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full font-semibold text-lg"
      >
        <span>Filters</span>
        <ChevronDown
          size={20}
          className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter city"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Min Fees</label>
              <input
                type="number"
                value={minFees}
                onChange={(e) => setMinFees(e.target.value)}
                placeholder="Minimum"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Fees</label>
              <input
                type="number"
                value={maxFees}
                onChange={(e) => setMaxFees(e.target.value)}
                placeholder="Maximum"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Minimum Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleApplyFilters}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-medium"
            >
              Apply Filters
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
