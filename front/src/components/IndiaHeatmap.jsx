import {
    ComposableMap,
    Geographies,
    Geography,
} from "react-simple-maps";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

// ✅ Color scale function
const getColorForValue = (value) => {
    if (value > 3000) return "#ef4444";
    if (value > 2000) return "#f97316";
    if (value > 1500) return "#facc15";
    if (value > 1000) return "#4ade80";
    return "#a5f3fc";
};

export default function IndiaHeatmap() {
    const [hoveredState, setHoveredState] = useState(null);
    const navigate = useNavigate();

    return (
        <div className="bg-white p-4 rounded-2xl shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">
                State-wise Fraud Heatmap (Mock)
            </h2>

            <ComposableMap
                projection="geoMercator"
                projectionConfig={{ center: [80, 22], scale: 1000 }}
                style={{ width: "100%", height: "500px" }}
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
                                            fill: getColorForValue(value),
                                            outline: "none",
                                            stroke: isHovered ? "#1e40af" : "#fff",
                                            strokeWidth: isHovered ? 2 : 0.5,
                                            filter: isHovered ? "drop-shadow(0 0 6px rgba(0,0,0,0.4))" : "none",
                                            transition: "all 1s ease-in-out",
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
