import { useState } from "react";
import axios from "axios";

export default function AckLookup() {
    const [ackNumber, setAckNumber] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        setError(null);
        setResult(null);

        if (!ackNumber.trim()) {
            setError("Please enter a valid ACK number.");
            return;
        }

        try {
            const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            const response = await axios.get(`${BASE_URL}/states/reports/ack/${ackNumber}`);

            setResult(response.data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 404) {
                setError("No report found for this ACK number.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">ACK Number Lookup:</h2>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={ackNumber}
                    onChange={(e) => setAckNumber(e.target.value)}
                    placeholder="Enter ACK number"
                    className="border px-3 py-2 rounded w-full text-sm"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                >
                    Search
                </button>
            </div>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            {result && (
                <div className="mt-4 text-sm text-gray-800 space-y-2">
                    <p><strong>Category:</strong> {result.category}</p>
                    <p><strong>Date:</strong> {new Date(result.fetchedDate).toLocaleDateString()}</p>
                    <p><strong>Suspect Number:</strong> +91-{result.suspectNumber}</p>
                    <p><strong>Victim Name:</strong> {result.victim.name}</p>
                    <p><strong>Victim Location:</strong> {result.victim.district}, {result.victim.state}</p>
                    <p><strong>Reported From:</strong> {result.district}, {result.state}</p>
                    <p>
                        <strong>Coordinates:</strong>{" "}
                        <span className="text-xs text-gray-600">
                            ({result.location.coordinates[1]}, {result.location.coordinates[0]})
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}
