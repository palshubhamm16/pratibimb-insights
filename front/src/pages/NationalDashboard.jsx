import SummaryCards from "../components/SummaryCards";
import IndiaHeatmap from "../components/IndiaHeatmap";
import TopStatesBarGraph from "../components/TopStatesBarGraph";
import ScamPieChart from "../components/ScamPieChart";
import TrendLineChart from "../components/TrendLineChart";
import FraudCategoryPieChart from "../components/FraudCategoryPieChart";
import TrendGraph from "../components/TrendGraph";


export default function NationalDashboard() {

  const totalTrendData = [
    { month: "2024-08", count: 300 },
    { month: "2024-09", count: 500 },
    { month: "2024-10", count: 650 },
    { month: "2024-11", count: 720 },
    { month: "2024-12", count: 410 },
    { month: "2025-01", count: 600 },
    { month: "2025-02", count: 680 },
    { month: "2025-03", count: 800 },
    { month: "2025-04", count: 670 },
    { month: "2025-05", count: 730 },
    { month: "2025-06", count: 620 },
    { month: "2025-07", count: 750 },
  ];

  const categoryTrendData = [
    {
      month: "2024-08",
      LoanScam: 100,
      KYCFraud: 80,
      UPIScam: 40,
      FakeJob: 50,
      Others: 30,
    },
    {
      month: "2024-09",
      LoanScam: 110,
      KYCFraud: 100,
      UPIScam: 60,
      FakeJob: 40,
      Others: 60,
    },
    {
      month: "2024-10",
      LoanScam: 130,
      KYCFraud: 110,
      UPIScam: 90,
      FakeJob: 70,
      Others: 50,
    },
    {
      month: "2024-11",
      LoanScam: 150,
      KYCFraud: 130,
      UPIScam: 100,
      FakeJob: 90,
      Others: 50,
    },
    {
      month: "2024-12",
      LoanScam: 110,
      KYCFraud: 80,
      UPIScam: 70,
      FakeJob: 80,
      Others: 70,
    },
    {
      month: "2025-01",
      LoanScam: 140,
      KYCFraud: 100,
      UPIScam: 80,
      FakeJob: 100,
      Others: 60,
    },
    {
      month: "2025-02",
      LoanScam: 150,
      KYCFraud: 110,
      UPIScam: 100,
      FakeJob: 90,
      Others: 80,
    },
    {
      month: "2025-03",
      LoanScam: 170,
      KYCFraud: 130,
      UPIScam: 130,
      FakeJob: 120,
      Others: 80,
    },
    {
      month: "2025-04",
      LoanScam: 160,
      KYCFraud: 120,
      UPIScam: 120,
      FakeJob: 100,
      Others: 70,
    },
    {
      month: "2025-05",
      LoanScam: 180,
      KYCFraud: 140,
      UPIScam: 110,
      FakeJob: 120,
      Others: 80,
    },
    {
      month: "2025-06",
      LoanScam: 160,
      KYCFraud: 100,
      UPIScam: 130,
      FakeJob: 110,
      Others: 120,
    },
    {
      month: "2025-07",
      LoanScam: 170,
      KYCFraud: 120,
      UPIScam: 120,
      FakeJob: 110,
      Others: 130,
    },
  ];


  const categoryData = [
    { category: "Loan Scam", count: 320 },
    { category: "KYC Fraud", count: 200 },
    { category: "UPI Scam", count: 150 },
    { category: "Fake Job", count: 110 },
    { category: "Others", count: 100 },
  ];

  return (
    <div className="p-6 bg-blue-200/30 min-h-screen">
      <div className="flex items-center justify-center mb-4 mx-auto">
        <h1 className="text-4xl tracking-tighter font-bold mb-6">National Fraud Analytics Dashboard</h1>
      </div>
      <SummaryCards />
      <IndiaHeatmap />
      <TopStatesBarGraph />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <TrendGraph
          totalData={totalTrendData}
          categoryData={categoryTrendData}
        />
        <FraudCategoryPieChart data={categoryData} />
      </div>
    </div>
  );
}
