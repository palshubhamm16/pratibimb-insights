import React from "react";
import dayjs from "dayjs";

export default function TopFraudDays({ data }) {
    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className="bg-white shadow rounded-lg p-6 max-w-7xl mx-auto w-full">
            <h2 className="text-lg font-semibold mb-4">📅 Top 10 Highest Fraud Days</h2>
            <ul className="divide-y divide-gray-200">
                {data.map((entry, idx) => (
                    <li key={idx} className="flex justify-between items-center py-2">
                        <span className="text-gray-700">
                            {dayjs(entry.date).format("DD MMM YYYY")}
                        </span>
                        <span className="font-bold text-blue-600">{entry.count} cases</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
