// components/StateSummaryCards.jsx
export default function StateSummaryCards({ totalCases, totalAmount, topCarriers }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white shadow rounded-lg p-4">
                <h3 className="text-gray-500 text-sm">Total Fraud Cases</h3>
                <p className="text-xl font-bold">{totalCases}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
                <h3 className="text-gray-500 text-sm">Total Fraud Amount</h3>
                <p className="text-xl font-bold">₹{totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
                <h3 className="text-gray-500 text-sm">Top 5 Affected Carriers</h3>
                <ul className="mt-2 space-y-1 text-sm">
                    {topCarriers.map((carrier, i) => (
                        <li key={i}>{carrier.name} – {carrier.count} cases</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
