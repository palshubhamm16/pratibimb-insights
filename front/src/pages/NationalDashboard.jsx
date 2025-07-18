import SummaryCards from "../components/SummaryCards";
import IndiaHeatmap from "../components/IndiaHeatmap";
import TopStatesBarGraph from "../components/TopStatesBarGraph";
import ScamPieChart from "../components/ScamPieChart";
import TrendLineChart from "../components/TrendLineChart";

export default function NationalDashboard() {
  return (
    <div className="p-6 bg-blue-200/30 min-h-screen">
      <div className="flex items-center justify-center mb-4 mx-auto">
        <h1 className="text-4xl tracking-tighter font-bold mb-6">National Fraud Analytics Dashboard</h1>
      </div>
      <SummaryCards />
      <IndiaHeatmap />
      <TopStatesBarGraph />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScamPieChart />
        <TrendLineChart />
      </div>
    </div>
  );
}
