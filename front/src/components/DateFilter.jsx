import { useState } from "react";

export default function DateFilter({ onFilterChange }) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleStartChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndChange = (e) => {
        setEndDate(e.target.value);
    };

    // date filter if not using submit button : immediately date save
    //   const handleStartChange = (e) => {
    //     const value = e.target.value;
    //     setStartDate(value);
    //     onFilterChange({ startDate: value, endDate });
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilterChange({ startDate, endDate });
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 mb-6 bg-white rounded-xl shadow p-4 ">
            <div className="mb-4 text-center">
                <h2 className="text-xl font-semibold ">Filter by Date Range</h2>
                <p className="text-sm text-gray-600 mb-2">
                    Select a date range to filter the data displayed in the fields.
                </p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-wrap justify-center items-center gap-[50px]">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="start-date">
                            Start Date :
                        </label>
                        <input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={handleStartChange}
                            className="border border-blue-500 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="end-date">
                            End Date
                        </label>
                        <input
                            id="end-date"
                            type="date"
                            value={endDate}
                            onChange={handleEndChange}
                            className="border border-blue-500 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center justify-center mt-5">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition">
                            Apply Filter
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
}
