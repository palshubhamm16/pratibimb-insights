import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
} from "react-simple-maps";
import { useState } from "react";

// Simplified India map topojson — already loaded for entire country
import indiaJson from "../data/india.json"; // Replace with your actual local TopoJSON

export default function StateMap({ stateName, districtData, coordinatesData }) {
    const [mode, setMode] = useState("district"); // "district" or "coordinates"
    const [tooltip, setTooltip] = useState(null);

    const filteredGeos = indiaJson.objects && indiaJson.objects.states
        ? Object.values(indiaJson.objects.states.geometries).filter(
            (geo) => geo.properties.st_nm === stateName
        )
        : [];

    return (
        <div className="bg-white p-4 rounded-xl shadow mt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{stateName} Map View</h2>
                <button
                    onClick={() => setMode(mode === "district" ? "coordinates" : "district")}
                    className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                    Toggle to {mode === "district" ? "Coordinates" : "District Heatmap"}
                </button>
            </div>

            <ComposableMap
                projection="geoMercator"
                projectionConfig={{ center: [78.9629, 22.5937], scale: 1200 }}
                style={{ width: "100%", height: "500px" }}
            >
                <Geographies geography={indiaJson}>
                    {({ geographies }) =>
                        geographies
                            .filter((geo) => geo.properties.st_nm === stateName)
                            .map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    style={{
                                        default: { fill: "#E0F2FE", outline: "none" },
                                        hover: { fill: "#93C5FD", cursor: "pointer" },
                                        pressed: { fill: "#3B82F6" },
                                    }}
                                />
                            ))
                    }
                </Geographies>

                {/* 📍 Circle Heatmap Mode */}
                {mode === "district" &&
                    districtData.map((d, i) => (
                        <Marker key={i} coordinates={d.coords}>
                            <circle
                                r={Math.sqrt(d.reports) * 0.5}
                                fill="#EF4444"
                                stroke="#fff"
                                strokeWidth={1}
                                onMouseEnter={() => setTooltip(d)}
                                onMouseLeave={() => setTooltip(null)}
                            />
                        </Marker>
                    ))}

                {/* 📍 Coordinates Mode */}
                {mode === "coordinates" &&
                    coordinatesData.map((point, i) => (
                        <Marker key={i} coordinates={[point.lon, point.lat]}>
                            <circle r={2} fill="#2563EB" />
                        </Marker>
                    ))}
            </ComposableMap>

            {/* 🪄 Tooltip */}
            {tooltip && (
                <div className="mt-4 text-center text-gray-700">
                    <p className="text-lg font-medium">{tooltip.name}</p>
                    <p className="text-sm">Reports: {tooltip.reports}</p>
                </div>
            )}
        </div>
    );
}
