import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import StateMap from "../components/StateMap";
import StateSummaryCards from "../components/StateSummaryCards";
import TopDistrictsBarChart from "../components/TopDistrictsBarChart";
import FraudCategoryPieChart from "../components/FraudCategoryPieChart";
import TrendGraph from "../components/TrendGraph";
import DateFilter from "../components/DateFilter";
import DateHeatmap from "../components/DateHeatmap";
import TopFraudDays from "../components/TopFraudDays";
import TopSuspectNumbers from "../components/TopSuspectNumbers";
import ScammerCheck from "../components/ScammerCheck";

import {
    fetchStateSummary,
    fetchTopDistricts,
    fetchCategoryDistribution,
    fetchTrendData,
    fetchTopDays,
} from "../utils/api/stateApi";

export default function StatePage() {
    const { stateName } = useParams();
    const formattedStateName = stateName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

    const [summaryData, setSummaryData] = useState(null);
    const [topDistricts, setTopDistricts] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [trendData, setTrendData] = useState({ dailyCases: [], categoryWiseTrend: {} });
    const [topDays, setTopDays] = useState([]);

    const handleFilterChange = ({ startDate, endDate }) => {
        setDateRange({ startDate, endDate });
    };

    const loadData = async (startDate = null, endDate = null) => {
        try {
            const stateParam = stateName;

            const [summary, districts, categories, trends, days] = await Promise.all([
                fetchStateSummary(stateParam, startDate, endDate),
                fetchTopDistricts(stateParam, startDate, endDate),
                fetchCategoryDistribution(stateParam, startDate, endDate),
                fetchTrendData(stateParam, startDate, endDate),
                fetchTopDays(stateParam, startDate, endDate),
            ]);

            setSummaryData(summary);
            setTopDistricts(districts);
            setCategoryData(categories);
            setTrendData(trends);
            setTopDays(days);
        } catch (error) {
            console.error("Error loading state data:", error);
        }
    };

    useEffect(() => {
        const { startDate, endDate } = dateRange;
        loadData(startDate, endDate);
    }, [stateName, dateRange]);

    // Static mock for non-date-filtered components
    const mockTopSuspects = [
        { number: "9876543210", count: 12 },
        { number: "9123456789", count: 10 },
        { number: "9988776655", count: 9 },
        { number: "9000012345", count: 8 },
        { number: "8443322110", count: 7 },
        { number: "8080808080", count: 6 },
        { number: "9111222333", count: 5 },
        { number: "7000000000", count: 4 },
        { number: "9999999999", count: 3 },
        { number: "8000000001", count: 3 },
    ];

    const dummyData = Array.from({ length: 90 }).map((_, i) => ({
        date: dayjs().subtract(i, "day").format("YYYY-MM-DD"),
        count: Math.floor(Math.random() * 10),
    }));

    return (
        <div className="p-6 bg-blue-200/30 min-h-screen">
            <div className="mb-6 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight">{formattedStateName}</h1>
                <p className="text-gray-500 text-sm mt-1">State-level Fraud Analytics</p>
            </div>

            {/* Choropleth Map */}
            <div className="mb-10">
                <StateMap stateName={stateName} districtData={topDistricts} />
            </div>

            {/* Date Filter */}
            <DateFilter onFilterChange={handleFilterChange} />

            {/* Summary Cards */}
            {summaryData && (
                <div className="mb-10">
                    <StateSummaryCards
                        totalCases={summaryData.totalCases}
                        totalAmount={summaryData.totalAmount}
                        topCarriers={summaryData.topCarriers}
                    />
                </div>
            )}

            {/* Top Districts */}
            {/* <div className="mb-10">
                <TopDistrictsBarChart data={topDistricts} />
            </div> */}

            {/* Trend & Category Pie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <TrendGraph
                    totalData={trendData.dailyCases}
                    categoryData={trendData.categoryWiseTrend}
                />
                <FraudCategoryPieChart data={categoryData} />
            </div>

            {/* Static Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <TopFraudDays data={topDays} />
                <TopSuspectNumbers data={mockTopSuspects} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <DateHeatmap data={dummyData} />
                <ScammerCheck />
            </div>
        </div>
    );
}
