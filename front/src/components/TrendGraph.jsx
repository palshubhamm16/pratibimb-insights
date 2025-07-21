import { useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
} from "recharts";

export default function TrendGraph({ totalData, categoryData }) {
    const [mode, setMode] = useState("total");

    return (
        <div className="bg-white p-4 rounded-xl shadow ">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Monthly Fraud Trends</h2>
                <button
                    onClick={() =>
                        setMode((prev) => (prev === "total" ? "category" : "total"))
                    }
                    className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                    Switch to {mode === "total" ? "Category-wise" : "Total"} View
                </button>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={mode === "total" ? totalData : categoryData}
                    margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        content={(props) => (
                            <div className="mt-4 mb-3 ml-5 flex flex-wrap justify-center gap-4">
                                {props.payload.map((entry, index) => (
                                    <div key={`item-${index}`} className="flex items-center space-x-2">
                                        <div
                                            className="w-4 h-2 rounded"
                                            style={{ backgroundColor: entry.color }}
                                        ></div>
                                        <span className="text-sm text-gray-700">{entry.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    />

                    {mode === "total" ? (
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#2563EB"
                            strokeWidth={2}
                        />
                    ) : (
                        <>
                            {Object.keys(categoryData[0] || {})
                                .filter((k) => k !== "month")
                                .map((category, i) => (
                                    <Line
                                        key={category}
                                        type="monotone"
                                        dataKey={category}
                                        stroke={colors[i % colors.length]}
                                        strokeWidth={2}
                                    />
                                ))}
                        </>
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

const colors = [
    "#EF4444", // red
    "#3B82F6", // blue
    "#10B981", // green
    "#F59E0B", // amber
    "#8B5CF6", // violet
];
