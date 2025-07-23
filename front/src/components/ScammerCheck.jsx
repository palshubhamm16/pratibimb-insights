import { useState } from "react";
import axios from "axios";

export default function ScammerCheck() {
    const [number, setNumber] = useState("");
    const [result, setResult] = useState(null);
    const [count, setCount] = useState(null);
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        setError(null);
        setResult(null);
        setCount(null);
        setLocations([]);

        if (!number.trim()) {
            setError("Please enter a valid phone number.");
            return;
        }

        try {
            const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            const response = await axios.get(`${BASE_URL}/states/scam-count`, {
                params: { number },
            });

            const { count, locations } = response.data;

            if (count > 0) {
                setResult("Scammer reported");
                setCount(count);
                setLocations(locations);
            } else {
                setResult("No reports found");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Check if Number belongs to a Scammer:</h2>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-full">
                    <input
                        type="text"
                        value="+91"
                        disabled
                        className="border px-3 py-2 rounded text-sm bg-gray-100 w-20"
                        tabIndex={-1}
                    />
                    <input
                        type="tel"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="Enter phone number"
                        className="border px-3 py-2 rounded w-full text-sm"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm"
                >
                    Check
                </button>
            </div>

            {result && (
                <div className="mt-4 text-sm text-gray-700">
                    <p>
                        Result: <span className="font-medium">{result}</span>
                        {count !== null && (
                            <span className="ml-2 text-orange-600">({count} report{count > 1 ? "s" : ""})</span>
                        )}
                    </p>

                    {locations.length > 0 && (
                        <div className="mt-3">
                            <p className="font-medium mb-1">Reported Locations:</p>
                            <ul className="list-disc list-inside space-y-1">
                                {locations.map((loc, i) => (
                                    <li key={i}>
                                        {loc.district}, {loc.state} –{" "}
                                        <span className="text-xs text-gray-600">
                                            ({loc.lat}, {loc.lng})
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
