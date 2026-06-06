import { Link } from 'react-router-dom';
import { Star, MapPin, DollarSign, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { savedAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CollegeCard = ({ college, onSave }) => {
  const { isAuthenticated } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveCollege = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to save colleges');
      return;
    }

    setIsSaving(true);
    try {
      await savedAPI.saveCollege(college._id);
      setIsSaved(true);
      if (onSave) onSave(college._id);
      setTimeout(() => setIsSaving(false), 500);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save college');
      setIsSaving(false);
    }
  };

  return (
    <Link to={`/college/${college._id}`} className="block">
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 overflow-hidden h-full">
        <img
          src={college.image}
          alt={college.name}
          className="w-full h-48 object-cover"
        />

        <div className="p-4">
          <h3 className="text-xl font-bold mb-2 text-gray-800">{college.name}</h3>

          <div className="space-y-2 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-600" />
              <span>{college.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-green-600" />
              <span>₹{college.fees?.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-500" />
              <span className="font-semibold">{college.rating}/5</span>
            </div>
          </div>

          <p className="text-gray-700 text-sm mb-4 line-clamp-2">{college.overview}</p>

          <div className="flex gap-2">
            <button
              onClick={handleSaveCollege}
              disabled={isSaving || isSaved}
              className={`flex-1 py-2 rounded font-medium transition text-sm flex items-center justify-center gap-2 ${
                isSaved
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle size={16} /> Saved
                </>
              ) : (
                'Save College'
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CollegeCard;