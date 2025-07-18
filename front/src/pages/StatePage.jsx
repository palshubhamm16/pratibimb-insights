import { useParams } from "react-router-dom";
import StateMap from "../components/StateMap";
import StateSummaryCards from "../components/StateSummaryCards";
import TopDistrictsBarChart from "../components/TopDistrictsBarChart";
import FraudCategoryPieChart from "../components/FraudCategoryPieChart";
import TrendGraph from "../components/TrendGraph";

export default function StatePage() {
    const { stateName } = useParams();
    const formattedStateName = stateName
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    // Mock data for Maharashtra
    const districtData = {
        "PUNE": 150,
        "MUMBAI": 300,
        "NAGPUR": 100,
        "AURANGABAD": 80,
        "NASHIK": 50,
        "SOLAPUR": 40,
        "THANE": 90,
        "JALGAON": 30,
        "KOLHAPUR": 25,
        "SANGLI": 15,
    };

    const summaryData = {
        totalCases: 880,
        totalAmount: 15400000,
        topCarriers: [
            { name: "Jio", count: 320 },
            { name: "Airtel", count: 280 },
            { name: "Vi", count: 160 },
            { name: "BSNL", count: 90 },
            { name: "MTNL", count: 30 },
        ],
    };

    const topDistricts = Object.entries(districtData)
        .map(([district, count]) => ({ district, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    const categoryData = [
        { category: "Loan Scam", count: 320 },
        { category: "KYC Fraud", count: 200 },
        { category: "UPI Scam", count: 150 },
        { category: "Fake Job", count: 110 },
        { category: "Others", count: 100 },
    ];

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

    return (
        <div className="p-6 bg-blue-200/30 min-h-screen">
            <div className="mb-6 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight">
                    {formattedStateName}
                </h1>
                <p className="text-gray-500 text-sm mt-1">State-level Fraud Analytics</p>
            </div>

            <div className="mb-10">
                <StateMap stateName="maharashtra" districtData={districtData} />
            </div>

            <div className="mb-10">
                <StateSummaryCards
                    totalCases={summaryData.totalCases}
                    totalAmount={summaryData.totalAmount}
                    topCarriers={summaryData.topCarriers}
                />
            </div>

            <div className="mb-10">
                <TopDistrictsBarChart data={topDistricts} />
            </div>


            {/* Half-width trend graph + pie chart */}
            <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2 ">
                    <TrendGraph
                        totalData={totalTrendData}
                        categoryData={categoryTrendData}
                    />
                </div>
                <div className="w-full md:w-1/2 px-2 ">
                    <FraudCategoryPieChart data={categoryData} />
                </div>
            </div>

        </div>
    );
}
