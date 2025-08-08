import {
    ComposableMap,
    Geographies,
    Geography,
} from "react-simple-maps";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as d3 from "d3";
import indiaGeo from "../data/india.json";

// ✅ Mock fraud data
const mockFraudData = {
    "Maharashtra": 3200,
    "Uttar Pradesh": 2800,
    "Bihar": 1500,
    "Delhi": 2100,
    "Gujarat": 1700,
    "Rajasthan": 1200,
    "West Bengal": 2200,
    "Karnataka": 1900,
    "Tamil Nadu": 2500,
    "Madhya Pradesh": 1300,
    "Odisha": 1100,
    "Haryana": 800,
    "Punjab": 1000,
};

// ✅ Create a dynamic color scale based on data
const fraudCounts = Object.values(mockFraudData);
const maxFraud = fraudCounts.length > 0 ? Math.max(...fraudCounts) : 1;
const colorScale = d3.scaleSequential(d3.interpolateReds).domain([0, maxFraud]);

const getRelativeColor = (count) =>
    typeof count === "number" && count > 0 ? colorScale(count) : "rgba(156, 163, 175, 0.45)";

export default function IndiaHeatmap() {
    const [hoveredState, setHoveredState] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();

    return (
        <div className="bg-white p-4 rounded-2xl shadow mb-6 relative mx-[40px]">
            <div className="mb-4 text-center">
                <h2 className="text-2xl font-semibold mb-4">
                    State-wise Fraud Heatmap
                </h2>
                <h3 className="text-sm text-gray-600">
                    (Click on State to Open State Page)
                </h3>
            </div>

            <ComposableMap
                projection="geoMercator"
                projectionConfig={{ center: [81.4, 23.5], scale: 1030 }}
                style={{ width: "100%", height: "800px" }}
            >
                <Geographies geography={indiaGeo}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            const stateName = geo.properties.st_nm;
                            const value = mockFraudData[stateName] || 0;

                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    onMouseEnter={(e) => {
                                        setHoveredState(stateName);
                                        setTooltipPos({ x: e.clientX, y: e.clientY });
                                    }}
                                    onMouseMove={(e) => {
                                        setTooltipPos({ x: e.clientX, y: e.clientY });
                                    }}
                                    onMouseLeave={() => {
                                        setHoveredState(null);
                                    }}
                                    onClick={() => navigate(`/state/${stateName}`)}
                                    style={{
                                        default: {
                                            fill: getRelativeColor(value),
                                            outline: "none",
                                            stroke: "#fff",
                                            strokeWidth: 0.5,
                                            transition: "all 0.3s ease-in-out",
                                        },
                                        hover: {
                                            fill: "#6366f1",
                                            cursor: "pointer",
                                        },
                                        pressed: {
                                            fill: "#312e81",
                                        },
                                    }}
                                />
                            );
                        })
                    }
                </Geographies>
            </ComposableMap>

            {/*  Legend */}
            <div className="absolute top-[340px] left-6 w-3 h-64 bg-gradient-to-t from-[#fee5d9] to-[#a50f15] rounded">
                {/* Labels */}
                <div className="absolute right-[-50px] top-0 text-sm text-gray-600">
                    {maxFraud}
                </div>
                <div className="absolute right-[-50px] top-1/2 transform -translate-y-1/2 text-sm text-gray-600">
                    {Math.round(maxFraud / 2)}
                </div>
                <div className="absolute right-[-36px] bottom-0 text-sm text-gray-600">
                    0
                </div>
                <div className="absolute right-[-16px] bottom-[-30px] text-xs text-gray-700">
                    Reports
                </div>
            </div>

            {/* Floating Tooltip */}
            {hoveredState && (
                <div
                    className="absolute bg-white shadow-md rounded px-3 py-2 text-sm border border-gray-300 pointer-events-none"
                    style={{
                        top: tooltipPos.y + 10,
                        left: tooltipPos.x + 10,
                        transform: "translate(-50%, -100%)",
                        zIndex: 1000,
                    }}
                >
                    <p className="font-bold">{hoveredState}</p>
                    <p className="text-red-600 font-semibold">
                        Reports: {mockFraudData[hoveredState] || 0}
                    </p>
                </div>
            )}
        </div>
    );
}
