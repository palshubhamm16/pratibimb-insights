// components/ScammerCheck.jsx
import { useState } from "react";

export default function ScammerCheck({ onSearch }) {
    const [number, setNumber] = useState("");
    const [result, setResult] = useState(null);

    const handleSearch = async () => {
        // Simulated check
        const found = number === "9876543210"; // mock check
        setResult(found ? "Scammer reported" : "No reports found");
        onSearch?.(number, found);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Check if Number is a Scammer</h2>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Enter phone number"
                    className="border px-3 py-2 rounded w-full text-sm"
                />
                <button
                    onClick={handleSearch}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm"
                >
                    Check
                </button>
            </div>
            {result && (
                <div className="mt-3 text-sm text-gray-700">
                    Result: <span className="font-medium">{result}</span>
                </div>
            )}
        </div>
    );
}
