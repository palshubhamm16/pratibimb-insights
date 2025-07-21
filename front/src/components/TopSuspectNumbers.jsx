// components/TopSuspectNumbers.jsx
import React from "react";

export default function TopSuspectNumbers({ data }) {
    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className="bg-white shadow rounded-lg p-6 max-w-7xl mx-auto w-full">
            <h2 className="text-lg font-semibold mb-4">📞 Top 10 Suspect Numbers</h2>
            <ul className="divide-y divide-gray-200">
                {data.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center py-2">
                        <span className="text-gray-700">{item.number}</span>
                        <span className="font-bold text-red-600">{item.count} cases</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
