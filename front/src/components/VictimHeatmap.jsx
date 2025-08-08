import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as d3 from "d3";
import indiaGeo from "../data/india.json";

export default function VictimHeatmap({ data = [] }) {
  const [hoveredState, setHoveredState] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const fraudData = data.reduce((acc, curr) => {
    acc[curr.state.toUpperCase()] = {
      victims: curr.victimCount,
      amount: curr.fraudAmount,
    };
    return acc;
  }, {});

  const counts = Object.values(fraudData).map((d) => d?.victims || 0);
  const maxVictims = counts.length > 0 ? Math.max(...counts) : 1;
  const colorScale = d3.scaleSequential(d3.interpolateReds).domain([0, maxVictims]);

  const getRelativeColor = (count) =>
    typeof count === "number" && count > 0
      ? colorScale(count)
      : "rgba(156, 163, 175, 0.45)";

  return (
    <div className="bg-white p-4 rounded-2xl shadow mb-6 relative mx-[80px]">
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
                  onMouseMove={(evt) =>
                    setMousePosition({ x: evt.clientX, y: evt.clientY })
                  }
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

      {/* Color Legend */}
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

      {/* Floating Tooltip */}
      {hoveredState && (
        <div
          className="pointer-events-none absolute z-50 px-3 py-2 rounded-xl bg-white border border-gray-300 shadow-lg"
          style={{
            top: mousePosition.y + 10,
            left: mousePosition.x + 10,
            minWidth: "180px",
          }}
        >
          <div className="text-sm font-semibold text-gray-800">
            {hoveredState}
          </div>
          <div className="text-sm text-red-600">
            Victims: {fraudData[hoveredState]?.victims || 0}
          </div>
          <div className="text-sm text-green-600">
            ₹ {fraudData[hoveredState]?.amount?.toLocaleString() || 0}
          </div>
        </div>
      )}
    </div>
  );
}
