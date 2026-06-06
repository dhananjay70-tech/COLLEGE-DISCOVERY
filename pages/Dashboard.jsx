import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { savedAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CollegeCard from '../components/CollegeCard';
import Loader from '../components/Loader';
import { Trash2 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [savedColleges, setSavedColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSavedColleges();
    }
  }, [isAuthenticated]);

  const fetchSavedColleges = async () => {
    try {
      const response = await savedAPI.getSavedColleges();
      setSavedColleges(response.data.data);
    } catch (error) {
      console.error('Error fetching saved colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveCollege = async (collegeId) => {
    try {
      await savedAPI.unsaveCollege(collegeId);
      setSavedColleges(savedColleges.filter(c => c._id !== collegeId));
      alert('College removed from saved');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to remove college');
    }
  };

  if (authLoading || loading) return <Loader />;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* User Info */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-600 mb-2">Email: {user?.email}</p>
          <p className="text-gray-600">
            You have {savedColleges.length} saved college{savedColleges.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Saved Colleges */}
        <div>
          <h2 className="text-3xl font-bold mb-8">Saved Colleges</h2>

          {savedColleges.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedColleges.map((college) => (
                <div key={college._id} className="relative">
                  <CollegeCard college={college} />
                  <button
                    onClick={() => handleUnsaveCollege(college._id)}
                    className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-xl text-gray-600 mb-4">
                You haven't saved any colleges yet
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Explore Colleges
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;