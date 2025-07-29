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
import AckLookup from "../components/AckLookup";
import VictimHeatmap from "../components/VictimHeatmap";

import {
    fetchStateSummary,
    fetchTopDistricts,
    fetchCategoryDistribution,
    fetchTrendData,
    fetchTopDays,
    fetchTopSuspects,
    fetchVictimMapping,
} from "../utils/api/stateApi";

export default function StatePage() {
    const { stateName } = useParams();
    const formattedStateName = stateName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    const [filters, setFilters] = useState({
        startDate: null,
        endDate: null,
        categories: [],
    });

    const [summaryData, setSummaryData] = useState(null);
    const [topDistricts, setTopDistricts] = useState([]);
    const [allDistricts, setAllDistricts] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [trendData, setTrendData] = useState({});
    const [topDays, setTopDays] = useState([]);
    const [topSuspects, setTopSuspects] = useState([]);
    const [victimMapping, setVictimMapping] = useState([]);

    const handleFilterChange = ({ startDate, endDate, categories }) => {
        setFilters({ startDate, endDate, categories });
    };

    const loadData = async (startDate = null, endDate = null, categories = []) => {
        try {
            const stateParam = stateName;

            const [summary, districts, categoriesData, trends, days, suspects, mapping] =
                await Promise.all([
                    fetchStateSummary(stateParam, startDate, endDate, categories),
                    fetchTopDistricts(stateParam, startDate, endDate, categories),
                    fetchCategoryDistribution(stateParam, startDate, endDate, categories),
                    fetchTrendData(stateParam, startDate, endDate, categories),
                    fetchTopDays(stateParam, startDate, endDate, categories),
                    fetchTopSuspects(stateParam, startDate, endDate, categories),
                    fetchVictimMapping(stateParam, startDate, endDate, categories),
                ]);

            setSummaryData(summary);
            setAllDistricts(districts);
            setTopDistricts(
                Object.entries(districts)
                    .map(([district, count]) => ({ district, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10)
            );
            setCategoryData(categoriesData);
            setTrendData(trends);
            setTopDays(days);
            setTopSuspects(suspects);
            setVictimMapping(mapping);

        } catch (error) {
            console.error("Error loading state data:", error);
        }
    };

    useEffect(() => {
        const { startDate, endDate, categories } = filters;
        loadData(startDate, endDate, categories);
    }, [stateName, filters]);

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

            {/* Map */}
            <div className="mb-10">
                <StateMap stateName={stateName} districtData={allDistricts} />
            </div>

            {/* Filter */}
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
            <div className="mb-10">
                <TopDistrictsBarChart data={topDistricts} />
            </div>

            {/* Victim Map */}
            <div className="mb-10">
                <VictimHeatmap data={victimMapping} />
            </div>

            {/* Trends & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <TrendGraph
                    totalData={trendData.totalTrendData}
                    categoryData={trendData.categoryTrendData}
                />
                <FraudCategoryPieChart data={categoryData} />
            </div>

            {/* Other Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <TopFraudDays data={topDays} />
                <TopSuspectNumbers data={topSuspects} />
            </div>

            {/* Misc */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <DateHeatmap data={dummyData} />
                <ScammerCheck />
            </div>

            <div>
                <AckLookup />
            </div>
        </div>
    );
}
