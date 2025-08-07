import { useEffect, useState } from "react";
import {
  fetchNationalSummary,
  fetchIndiaHeatmapData,
  fetchTopStates,
  fetchNationalTrends,
  fetchNationalCategoryBreakdown
} from "../utils/api/countryApi";

import SummaryCards from "../components/SummaryCards";
import IndiaHeatmap from "../components/IndiaHeatmap";
import TopStatesBarGraph from "../components/TopStatesBarGraph";
import TrendGraph from "../components/TrendGraph";
import FraudCategoryPieChart from "../components/FraudCategoryPieChart";
import DateFilter from "../components/DateFilter"; // Optional filter component (if you have it)

export default function NationalDashboard() {
  const [summary, setSummary] = useState({});
  const [heatmapData, setHeatmapData] = useState([]);
  const [topStates, setTopStates] = useState([]);
  const [totalTrendData, setTotalTrendData] = useState([]);
  const [categoryTrendData, setCategoryTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  // Filter states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const fetchData = async () => {
    const [summaryRes, heatmapRes, topStatesRes, trendRes, categoryRes] = await Promise.all([
      fetchNationalSummary(startDate, endDate, selectedCategories),
      fetchIndiaHeatmapData(startDate, endDate, selectedCategories),
      fetchTopStates(startDate, endDate, selectedCategories),
      fetchNationalTrends(startDate, endDate, selectedCategories),
      fetchNationalCategoryBreakdown(startDate, endDate, selectedCategories)
    ]);

    setSummary(summaryRes);
    console.log("Summary Data:", summaryRes);
    setHeatmapData(heatmapRes);
    setTopStates(topStatesRes);
    setTotalTrendData(trendRes.totalTrendData || []);
    // console.log("Total Trend Data:", trendRes);
    // console.log("Category Trend Data:", trendRes);
    setCategoryTrendData(trendRes.categoryTrendData || []);
    setCategoryData(categoryRes);
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, selectedCategories]);

  return (
    <div className="p-6 bg-blue-200/30 min-h-screen">
      <div className="flex items-center justify-center mb-4 mx-auto">
        <h1 className="text-4xl tracking-tighter font-bold mb-6">National Fraud Analytics Dashboard</h1>
      </div>

      {/* Optional: Add date/category filter if needed */}
      {/* <DateFilter
        startDate={startDate}
        endDate={endDate}
        selectedCategories={selectedCategories}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onCategoriesChange={setSelectedCategories}
      /> */}

      <SummaryCards data={summary} />
      <IndiaHeatmap data={heatmapData} />
      <TopStatesBarGraph data={topStates} />

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
