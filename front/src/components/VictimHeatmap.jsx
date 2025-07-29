import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as d3 from "d3";
import indiaGeo from "../data/india.json";

// ✅ This component now accepts data prop from backend
export default function VictimHeatmap({ data = [] }) {
  const [hoveredState, setHoveredState] = useState(null);
  const navigate = useNavigate();

  // ✅ Convert API array to a dictionary: { DELHI: { victims, amount }, ... }
  const fraudData = data.reduce((acc, curr) => {
    acc[curr.state.toUpperCase()] = {
      victims: curr.victimCount,
      amount: curr.fraudAmount,
    };
    return acc;
  }, {});

  // ✅ Setup color scale based on max victims
  const counts = Object.values(fraudData).map((d) => d?.victims || 0);
  const maxVictims = counts.length > 0 ? Math.max(...counts) : 1;
  const colorScale = d3.scaleSequential(d3.interpolateReds).domain([0, maxVictims]);

  const getRelativeColor = (count) =>
    typeof count === "number" && count > 0
      ? colorScale(count)
      : "rgba(156, 163, 175, 0.45)";

  return (
    <div className="bg-white p-4 rounded-2xl shadow mb-6 relative">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          State-wise Victim Heatmap
        </h2>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [81.4, 23.5], scale: 1030 }}
        style={{ width: "100%", height: "800px" }}
      >
        <Geographies geography={indiaGeo}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.st_nm.toUpperCase();
              const isHovered = hoveredState === stateName;
              const value = fraudData[stateName]?.victims || 0;

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

      {/* ✅ Color Legend */}
      <div className="absolute top-[340px] left-6 w-3 h-64 bg-gradient-to-t from-[#fee5d9] to-[#a50f15] rounded">
        <div className="absolute right-[-50px] top-0 text-sm text-gray-600">
          {maxVictims}
        </div>
        <div className="absolute right-[-50px] top-1/2 transform -translate-y-1/2 text-sm text-gray-600">
          {Math.round(maxVictims / 2)}
        </div>
        <div className="absolute right-[-36px] bottom-0 text-sm text-gray-600">
          0
        </div>
        <div className="absolute right-[-16px] bottom-[-30px] text-xs text-gray-700">
          Victims
        </div>
      </div>

      {/* ✅ Hover Info */}
      {hoveredState && (
        <div className="mt-4 text-center text-gray-700">
          <p className="text-lg font-medium">{hoveredState}</p>
          <p className="text-sm">
            Victims: {fraudData[hoveredState]?.victims || 0}
          </p>
          <p className="text-sm">
            Total Fraud ₹: {fraudData[hoveredState]?.amount?.toLocaleString() || 0}
          </p>
        </div>
      )}
    </div>
  );
}
