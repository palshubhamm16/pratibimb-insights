import React from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

// Weekday labels
const weekdays = ["Mon", "Wed", "Fri"];

export default function DateHeatmap({ data }) {
    const today = dayjs();
    const startDate = today.subtract(89, "day").startOf("day");

    // Normalize data to a map
    const dataMap = data.reduce((acc, item) => {
        const key = dayjs(item.date).format("DD-MM-YYYY");
        acc[key] = item.count;
        return acc;
    }, {});

    // Generate 90 days of cells
    const days = [];
    for (let i = 0; i < 90; i++) {
        const date = startDate.add(i, "day");
        days.push(date);
    }

    // Group into weeks (columns)
    const weeks = [];
    let currentWeek = [];
    for (let d of days) {
        currentWeek.push(d);
        if (d.isoWeekday() === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }
    if (currentWeek.length) weeks.push(currentWeek);

    const maxCount = Math.max(...data.map((d) => d.count), 1);

    const getColor = (count) => {
        if (!count) return "#E5E7EB"; // gray-200
        const intensity = Math.min(1, count / maxCount);
        return `rgba(251, 146, 60, ${0.2 + intensity * 0.8})`; // orange-400
    };

    const getMonthLabel = (week) => {
        const firstDay = week[0];
        const prevWeek = weeks[weeks.indexOf(week) - 1];
        if (!prevWeek) return firstDay.format("MMM");
        const prevMonth = prevWeek[0].month();
        if (firstDay.month() !== prevMonth) return firstDay.format("MMM");
        return "";
    };

    return (
        <div className="w-full mx-auto px-4 py-6 bg-white rounded-xl shadow overflow-x-auto items-center">
            <h2 className="text-xl font-semibold mb-7">Fraud Heatmap (Last 90 Days)</h2>
            <div className="flex gap-2 text-xs justify-center items-center mb-4">
                {/* Weekday labels */}
                <div className="flex flex-col justify-between py-1">
                    {Array(7)
                        .fill(0)
                        .map((_, i) => (
                            <div
                                key={i}
                                className="h-4 text-gray-400"
                                style={{ visibility: weekdays.includes(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]) ? "visible" : "hidden" }}
                            >
                                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i].slice(0, 3)}
                            </div>
                        ))}
                </div>

                {/* Heatmap grid */}
                <div className="flex overflow-x-auto">
                    {weeks.map((week, wi) => (
                        <div key={wi} className="flex flex-col items-center mr-1">
                            <div className="text-[10px] text-gray-500 mb-1">
                                {getMonthLabel(week)}
                            </div>
                            {Array(7)
                                .fill(0)
                                .map((_, i) => {
                                    const day = week[i];
                                    if (!day) return <div key={i} className="w-4 h-4 my-[1px]"></div>;
                                    const key = day.format("DD-MM-YYYY");
                                    const count = dataMap[key] || 0;
                                    return (
                                        <div
                                            key={i}
                                            className="w-4 h-4 rounded-sm my-[1px]"
                                            style={{ backgroundColor: getColor(count) }}
                                            title={`${key}: ${count} cases`}
                                        />
                                    );
                                })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
