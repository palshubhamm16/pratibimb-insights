export default function SummaryCards({ data }) {
  const {
    totalReports = 0,
    totalAmount = 0,
    thisMonthReports = 0,
  } = data || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-500 text-sm">Total Reports</p>
        <h2 className="text-2xl font-bold">{totalReports.toLocaleString()}</h2>
      </div>
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-500 text-sm">Total Amount</p>
        <h2 className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</h2>
      </div>
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-500 text-sm">This Month</p>
        <h2 className="text-2xl font-bold">{thisMonthReports.toLocaleString()}</h2>
      </div>
    </div>
  );
}
