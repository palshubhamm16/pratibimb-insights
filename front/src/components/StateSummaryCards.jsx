// components/StateSummaryCards.jsx
export default function StateSummaryCards({ totalCases, totalAmount, topCarriers }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mx-[70px]">
            <div className=" shadow rounded-lg p-4 ring-2 ring-red-500 bg-red-100/50">
                <h3 className="text-black text-sm font-semibold">Total Fraud Cases</h3>
                <p className="text-xl font-bold text-red-600">{totalCases}</p>
            </div>
            <div className=" shadow rounded-lg p-4 ring-2 ring-green-500 bg-green-100/50">
                <h3 className="text-black text-sm font-semibold">Total Fraud Amount</h3>
                <p className="text-xl font-bold text-green-600">₹{totalAmount.toLocaleString()}</p>
            </div>
            <div className=" shadow rounded-lg p-4 ring-2 ring-orange-500 bg-orange-100/30">
                <h3 className="text-black text-sm font-semibold">Top 5 Affected Carriers</h3>
                <ul className="mt-2 space-y-1 text-sm text-orange-600 tracking-tight">
                    {topCarriers.map((carrier, i) => (
                        <li key={i}>{carrier.name} – {carrier.count} cases</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
