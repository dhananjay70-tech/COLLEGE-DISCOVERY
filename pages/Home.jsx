import { useState, useEffect } from 'react';
import { collegeAPI } from '../services/api';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import CollegeCard from '../components/CollegeCard';
import Loader from '../components/Loader';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchColleges();
  }, [currentPage, filters]);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        search,
        ...filters
      };

      const response = await collegeAPI.getAllColleges(params);
      setColleges(response.data.data);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearch(query);
    setCurrentPage(1);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">🎓 College Discovery Platform</h1>
          <p className="text-xl mb-8">
            Find your perfect college with detailed information on placements, courses, and fees
          </p>
          <div className="max-w-2xl">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="md:col-span-1">
            <Filters onFilter={handleFilter} />
          </div>

          {/* Colleges Grid */}
          <div className="md:col-span-3">
            {loading ? (
              <Loader />
            ) : colleges.length > 0 ? (
              <>
                <div className="mb-4 text-gray-600">
                  Found {colleges.length} colleges
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {colleges.map((college) => (
                    <CollegeCard key={college._id} college={college} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-12">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={18} /> Previous
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .slice(Math.max(0, currentPage - 3), currentPage + 2)
                        .map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded transition ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No colleges found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;