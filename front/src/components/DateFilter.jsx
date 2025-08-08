import { useState } from "react";

// You can also move this to props if needed
const categoriesList = [
  "Investment Scam",
  "Online Financial Fraud/UPI Related Frauds",
  "Cyber Bullying/Stalking",
  "Any Other Cyber Crime/Other",
  "Loan App Fraud",
  "Online Sextortion",
  "Job Fraud",
  "Impersonation on Social Media",
  "Fake Customer Care",
];

export default function DateFilter({ onFilterChange }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCategories((prev) => [...prev, value]);
    } else {
      setSelectedCategories((prev) => prev.filter((cat) => cat !== value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange({
      startDate,
      endDate,
      categories: selectedCategories,
    });
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setSelectedCategories([]);
    onFilterChange({
      startDate: "",
      endDate: "",
      categories: [],
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6 mb-6 bg-white rounded-xl shadow-md border border-gray-200 ring-1 ring-blue-300/50">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Advanced Filter</h2>
        <p className="text-sm text-gray-600 mt-1">
          Refine the results by selecting a date range and scam categories.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Filter Section */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-3">Scam Categories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categoriesList.map((category) => (
              <label
                key={category}
                className="flex items-center bg-blue-100/25 hover:bg-gray-200 px-3 py-2 rounded cursor-pointer transition border border-gray-300">
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={handleCategoryChange}
                  className="mr-2 accent-blue-600"
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition">
            Apply Filter
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded font-semibold hover:bg-gray-400 transition">
            Reset Filter
          </button>
        </div>
      </form>
    </div>
  );
}
