import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { savedAPI, collegeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Plus } from 'lucide-react';
import CompareTable from '../components/CompareTable';

const Compare = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedCollegeIds, setSelectedCollegeIds] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [availableColleges, setAvailableColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompareTable, setShowCompareTable] = useState(false);

  const handleFetchColleges = async () => {
    try {
      const response = await collegeAPI.getAllColleges({ limit: 100 });
      setAvailableColleges(response.data.data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const handleAddCollege = (collegeId) => {
    if (selectedCollegeIds.includes(collegeId)) {
      setSelectedCollegeIds(selectedCollegeIds.filter(id => id !== collegeId));
      setColleges(colleges.filter(c => c._id !== collegeId));
    } else if (selectedCollegeIds.length < 3) {
      setSelectedCollegeIds([...selectedCollegeIds, collegeId]);
      const college = availableColleges.find(c => c._id === collegeId);
      setColleges([...colleges, college]);
    } else {
      alert('You can compare up to 3 colleges only');
    }
  };

  const handleCompare = async () => {
    if (selectedCollegeIds.length < 2) {
      alert('Please select at least 2 colleges to compare');
      return;
    }

    try {
      const response = await savedAPI.compareColleges({
        collegeIds: selectedCollegeIds
      });
      setColleges(response.data.data);
      setShowCompareTable(true);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to compare colleges');
    }
  };

  const filteredColleges = availableColleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Compare Colleges</h1>

        {showCompareTable && (
          <CompareTable
            colleges={colleges}
            onClose={() => setShowCompareTable(false)}
          />
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Search and Selection */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Select Colleges to Compare</h2>
              <p className="text-gray-600 mb-4">
                Select up to 3 colleges to compare their features side by side
              </p>

              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search colleges..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (availableColleges.length === 0) {
                      handleFetchColleges();
                    }
                  }}
                  onFocus={handleFetchColleges}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredColleges.length > 0 ? (
                  filteredColleges.map((college) => (
                    <div
                      key={college._id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{college.name}</p>
                        <p className="text-sm text-gray-600">{college.location}</p>
                      </div>

                      <button
                        onClick={() => handleAddCollege(college._id)}
                        className={`px-4 py-2 rounded font-medium transition ${
                          selectedCollegeIds.includes(college._id)
                            ? 'bg-green-600 text-white'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {selectedCollegeIds.includes(college._id) ? '✓ Selected' : 'Select'}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-4">No colleges found</p>
                )}
              </div>
            </div>
          </div>

          {/* Selected Colleges */}
          <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-20">
            <h2 className="text-2xl font-bold mb-4">
              Selected ({selectedCollegeIds.length}/3)
            </h2>

            <div className="space-y-3 mb-6">
              {colleges.length > 0 ? (
                colleges.map((college) => (
                  <div
                    key={college._id}
                    className="flex items-start justify-between p-3 bg-blue-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{college.name}</p>
                      <p className="text-xs text-gray-600">{college.location}</p>
                    </div>

                    <button
                      onClick={() => handleAddCollege(college._id)}
                      className="p-1 hover:bg-red-100 rounded transition"
                    >
                      <X size={16} className="text-red-600" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center py-4">No colleges selected</p>
              )}
            </div>

            <button
              onClick={handleCompare}
              disabled={selectedCollegeIds.length < 2}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Compare Colleges
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;