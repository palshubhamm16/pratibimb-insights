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
    typeof count === "number" && count > 0 ? colorScale(count) : "#f0f0f0";

export default function IndiaHeatmap() {
    const [hoveredState, setHoveredState] = useState(null);
    const navigate = useNavigate();

    return (
        <div className="bg-white p-4 rounded-2xl shadow mb-6 relative">
            <div className="mb-4 text-center">
                <h2 className="text-xl font-semibold mb-4">
                    State-wise Fraud Heatmap
                </h2>
            </div>

            <ComposableMap
                projection="geoMercator"
                projectionConfig={{ center: [81.4, 22], scale: 900 }}
                style={{ width: "100%", height: "800px" }}
            >
                <Geographies geography={indiaGeo}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            const stateName = geo.properties.st_nm;
                            const isHovered = hoveredState === stateName;
                            const value = mockFraudData[stateName] || 0;

                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    onMouseEnter={() => setHoveredState(stateName)}
                                    onMouseLeave={() => setHoveredState(null)}
                                    onClick={() => navigate(`/state/${stateName}`)}
                                    style={{
                                        default: {
                                            fill: getRelativeColor(value),
                                            outline: "none",
                                            stroke: isHovered ? "#1e40af" : "#fff",
                                            strokeWidth: isHovered ? 2 : 0.5,
                                            filter: isHovered ? "drop-shadow(0 0 6px rgba(0,0,0,0.4))" : "none",
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

            {/* 🧠 Legend */}
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

            {hoveredState && (
                <div className="mt-4 text-center text-gray-700">
                    <p className="text-lg font-medium">{hoveredState}</p>
                    <p className="text-sm">
                        Mock Reports: {mockFraudData[hoveredState] || 0}
                    </p>
                </div>
            )}
        </div>
    );
}
