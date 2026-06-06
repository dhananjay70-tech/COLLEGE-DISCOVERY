import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, DollarSign, Users, TrendingUp, ArrowLeft } from 'lucide-react';
import { collegeAPI, savedAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const CollegeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const response = await collegeAPI.getCollegeById(id);
        setCollege(response.data.data);
      } catch (error) {
        console.error('Error fetching college:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollege();
  }, [id]);

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('Please login to add a review');
      navigate('/login');
      return;
    }

    if (!comment.trim()) {
      alert('Please enter a comment');
      return;
    }

    setSubmitting(true);
    try {
      const response = await collegeAPI.addReview(id, { rating, comment });
      setCollege(response.data.data);
      setRating(5);
      setComment('');
      alert('Review added successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveCollege = async () => {
    if (!isAuthenticated) {
      alert('Please login to save colleges');
      navigate('/login');
      return;
    }

    try {
      await savedAPI.saveCollege(id);
      setIsSaved(true);
      alert('College saved successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save college');
    }
  };

  if (loading) return <Loader />;

  if (!college) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">College not found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft size={20} /> Go Back
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <img
            src={college.image}
            alt={college.name}
            className="w-full h-96 object-cover"
          />

          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {college.name}
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <MapPin size={18} /> {college.location}
                </p>
              </div>

              <button
                onClick={handleSaveCollege}
                disabled={isSaved}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  isSaved
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSaved ? '✓ Saved' : 'Save College'}
              </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Star size={20} /> Rating
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  {college.rating}/5
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <DollarSign size={20} /> Fees
                </div>
                <p className="text-2xl font-bold text-green-600">
                  ₹{(college.fees / 100000).toFixed(1)}L
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <Users size={20} /> Courses
                </div>
                <p className="text-3xl font-bold text-purple-600">
                  {college.courses?.length || 0}
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                  <TrendingUp size={20} /> Placement
                </div>
                <p className="text-3xl font-bold text-orange-600">
                  {college.placements?.placementRate}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">{college.overview}</p>
            </div>

            {/* Courses */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold mb-4">Courses Offered</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {college.courses?.map((course, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600"
                  >
                    <p className="font-semibold text-gray-800">{course.name}</p>
                    <p className="text-sm text-gray-600">{course.duration}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Placements */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold mb-4">Placement Statistics</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Average Package</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{(college.placements?.averagePackage / 100000).toFixed(1)}L
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Highest Package</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ₹{(college.placements?.highestPackage / 100000).toFixed(1)}L
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Placement Rate</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {college.placements?.placementRate}%
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>

              {/* Add Review Form */}
              <form onSubmit={handleAddReview} className="mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Good</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Fair</option>
                    <option value={1}>1 - Poor</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Comment
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Adding Review...' : 'Add Review'}
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {college.reviews?.length > 0 ? (
                  college.reviews.map((review, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {review.userName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          {Array(review.rating)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className="fill-yellow-500 text-yellow-500"
                              />
                            ))}
                        </div>
                      </div>

                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h3 className="text-lg font-bold mb-4">Quick Info</h3>

              <div className="space-y-4">
                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-800">
                    {college.location}
                  </p>
                </div>

                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-600">Annual Fees</p>
                  <p className="font-semibold text-gray-800">
                    ₹{college.fees?.toLocaleString()}
                  </p>
                </div>

                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="font-semibold text-gray-800 flex items-center gap-2">
                    <Star size={16} className="fill-yellow-500 text-yellow-500" />
                    {college.rating}/5
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                  <p className="font-semibold text-gray-800">
                    {college.reviews?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetails;