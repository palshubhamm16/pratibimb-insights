export default function SummaryCards({ data }) {
  const {
    totalReports = 0,
    totalAmount = 0,
    thisMonthReports = 0,
  } = data || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mx-[70px]">
      <div className="shadow rounded-lg p-6 ring-2 ring-red-500 bg-red-100/50">
        <h3 className="text-black text-sm font-semibold">Total Reports</h3>
        <p className="text-2xl font-bold text-red-600">{totalReports.toLocaleString()}</p>
      </div>
      <div className="shadow rounded-lg p-6 ring-2 ring-green-500 bg-green-100/50">
        <h3 className="text-black text-sm font-semibold">Total Amount</h3>
        <p className="text-2xl font-bold text-green-600">₹{totalAmount.toLocaleString()}</p>
      </div>
      <div className="shadow rounded-lg p-6 ring-2 ring-blue-500 bg-blue-100/30">
        <h3 className="text-black text-sm font-semibold">This Month</h3>
        <p className="text-2xl font-bold text-blue-600">{thisMonthReports.toLocaleString()}</p>
      </div>
    </div>
  );
}
