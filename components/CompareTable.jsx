import { X } from 'lucide-react';

const CompareTable = ({ colleges, onClose }) => {
  if (!colleges || colleges.length === 0) {
    return null;
  }

  const metrics = [
    { label: 'Location', key: 'location' },
    { label: 'Fees', key: 'fees', format: (v) => `₹${v?.toLocaleString()}` },
    { label: 'Rating', key: 'rating', format: (v) => `${v}/5` },
    { label: 'Courses', key: 'courses', format: (v) => v?.length || 0 },
    {
      label: 'Avg Package',
      key: 'placements.averagePackage',
      format: (v) => `₹${v?.toLocaleString()}`
    },
    {
      label: 'Highest Package',
      key: 'placements.highestPackage',
      format: (v) => `₹${v?.toLocaleString()}`
    },
    {
      label: 'Placement Rate',
      key: 'placements.placementRate',
      format: (v) => `${v}%`
    }
  ];

  const getValue = (college, key) => {
    return key.split('.').reduce((obj, k) => obj?.[k], college);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-96 overflow-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold">College Comparison</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Metrics
                </th>
                {colleges.map((college) => (
                  <th
                    key={college._id}
                    className="px-6 py-3 text-left font-semibold text-gray-700"
                  >
                    {college.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {metrics.map((metric) => (
                <tr key={metric.key} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-700">
                    {metric.label}
                  </td>
                  {colleges.map((college) => (
                    <td key={college._id} className="px-6 py-3 text-gray-600">
                      {metric.format
                        ? metric.format(getValue(college, metric.key))
                        : getValue(college, metric.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompareTable;
