import { useEffect, useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
} from "react-simple-maps";
import { feature } from "topojson-client";
import * as d3 from "d3-geo";
import * as d3Scale from "d3-scale";

// --- GeoJSON dynamic import map ---
const geojsonMap = {
    andamanandnicobarislands: () => import("../data/state/andamannicobar.json"),
    andhrapradesh: () => import("../data/state/andhrapradesh.json"),
    arunachalpradesh: () => import("../data/state/arunachalpradesh.json"),
    assam: () => import("../data/state/assam.json"),
    bihar: () => import("../data/state/bihar.json"),
    chandigarh: () => import("../data/state/chandigarh.json"),
    chhattisgarh: () => import("../data/state/chhattisgarh.json"),
    dadranagarhaveli: () => import("../data/state/dadranagarhaveli.json"),
    delhi: () => import("../data/state/delhi.json"),
    goa: () => import("../data/state/goa.json"),
    gujarat: () => import("../data/state/gujarat.json"),
    haryana: () => import("../data/state/haryana.json"),
    himachalpradesh: () => import("../data/state/himachalpradesh.json"),
    jammukashmir: () => import("../data/state/jammukashmir.json"),
    jharkhand: () => import("../data/state/jharkhand.json"),
    karnataka: () => import("../data/state/karnataka.json"),
    kerala: () => import("../data/state/kerala.json"),
    ladakh: () => import("../data/state/ladakh.json"),
    lakshadweep: () => import("../data/state/lakshadweep.json"),
    madhyapradesh: () => import("../data/state/madhyapradesh.json"),
    maharashtra: () => import("../data/state/maharashtra.json"),
    manipur: () => import("../data/state/manipur.json"),
    meghalaya: () => import("../data/state/meghalaya.json"),
    mizoram: () => import("../data/state/mizoram.json"),
    nagaland: () => import("../data/state/nagaland.json"),
    odisha: () => import("../data/state/odisha.json"),
    puducherry: () => import("../data/state/puducherry.json"),
    punjab: () => import("../data/state/punjab.json"),
    rajasthan: () => import("../data/state/rajasthan.json"),
    sikkim: () => import("../data/state/sikkim.json"),
    tamilnadu: () => import("../data/state/tamilnadu.json"),
    telangana: () => import("../data/state/telangana.json"),
    tripura: () => import("../data/state/tripura.json"),
    uttarakhand: () => import("../data/state/uttarakhand.json"),
    uttarpradesh: () => import("../data/state/uttarpradesh.json"),
    westbengal: () => import("../data/state/westbengal.json"),
};

export const stateProjectionMap = {
    andamanandnicobarislands: { center: [92.62, 10.2], scale: 3800 },
    andhrapradesh: { center: [80.64, 15.91], scale: 3900 },
    arunachalpradesh: { center: [94.72, 28.2], scale: 5000 },
    assam: { center: [92.93, 26.1], scale: 6000 },
    bihar: { center: [85.7, 25.7], scale: 6500 },
    chandigarh: { center: [76.78, 30.73], scale: 68000 },
    chhattisgarh: { center: [81.6, 21.3], scale: 4200 },
    dadranagarhaveli: { center: [73.0, 20.3], scale: 6000 },
    delhi: { center: [77.1, 28.6], scale: 38000 },
    goa: { center: [74.0, 15.4], scale: 23000 },
    gujarat: { center: [71.5, 22.6], scale: 4600 },
    haryana: { center: [76.1, 29.3], scale: 7500 },
    himachalpradesh: { center: [77.3, 31.8], scale: 6500 },
    jammukashmir: { center: [75.3, 33.6], scale: 1800 },
    jharkhand: { center: [85.3, 23.6], scale: 2000 },
    karnataka: { center: [76.5, 14.5], scale: 1800 },
    kerala: { center: [76.1, 10.5], scale: 6300 },
    ladakh: { center: [77.1, 34.3], scale: 2800 },
    lakshadweep: { center: [72.0, 10.5], scale: 4000 },
    madhyapradesh: { center: [78.4, 23.4], scale: 1500 },
    maharashtra: { center: [76.4, 18.5], scale: 3900 },
    manipur: { center: [93.8, 24.7], scale: 12000 },
    meghalaya: { center: [91.2, 25.5], scale: 12000 },
    mizoram: { center: [92.9, 23.3], scale: 3000 },
    nagaland: { center: [94.4, 26.1], scale: 12000 },
    odisha: { center: [84.3, 20.3], scale: 5300 },
    puducherry: { center: [79.8, 11.9], scale: 5000 },
    punjab: { center: [75.3, 31.1], scale: 6000 },
    rajasthan: { center: [73.8, 26.5], scale: 3800 },
    sikkim: { center: [88.5, 27.5], scale: 10000 },
    tamilnadu: { center: [78.6, 10.8], scale: 5400 },
    telangana: { center: [79.0, 17.8], scale: 6500 },
    tripura: { center: [91.67, 23.75], scale: 14500 },
    uttarakhand: { center: [79.0, 30.1], scale: 2500 },
    uttarpradesh: { center: [80.9, 26.8], scale: 2500 },
    westbengal: { center: [87.8, 24.3], scale: 4200 },
    default: { center: [78.9, 22.0], scale: 1500 },
};

export default function StateMap({ stateName, districtData = {} }) {
    const [geoData, setGeoData] = useState(null);
    const [hoveredDistrict, setHoveredDistrict] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [showCircles, setShowCircles] = useState(true);

    useEffect(() => {
        const key = stateName.toLowerCase().replace(/\s/g, "");
        const loader = geojsonMap[key];

        if (!loader) {
            console.error(`[StateMap] No GeoJSON loader found for "${stateName}"`);
            return;
        }

        loader()
            .then((data) => {
                const topo = data.default;
                const geo = feature(topo, topo.objects[Object.keys(topo.objects)[0]]);
                setGeoData(geo);
            })
            .catch((err) => {
                console.error("GeoJSON load failed:", err);
            });
    }, [stateName]);

    const projectionConfig =
        stateProjectionMap[stateName.toLowerCase().replace(/\s/g, "")] ||
        stateProjectionMap["default"];

    if (!geoData) {
        return (
            <div className="text-center py-10 text-gray-500">
                Loading map for <b>{stateName}</b>...
            </div>
        );
    }

    const fraudCounts = Object.values(districtData).filter((n) => typeof n === "number");
    const maxFraud = fraudCounts.length ? Math.max(...fraudCounts) : 1;
    const minFraud = fraudCounts.length ? Math.min(...fraudCounts) : 0;
    const colorScale = d3Scale
        .scaleLinear()
        .domain([minFraud, maxFraud])
        .range(["#fee5d9", "#a50f15"]);

    return (
        <div className="bg-white rounded-xl shadow p-4 relative mx-[40px]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-center w-full">
                    Fraud Source Distribution by District – {stateName}
                </h2>
                <button
                    onClick={() => setShowCircles((prev) => !prev)}
                    className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded text-sm shadow"
                >
                    {showCircles ? "Show Gradient Map" : "Show Cluster Map"}
                </button>
            </div>

            <div style={{ width: "100%", height: "530px", overflow: "hidden" }}>
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={projectionConfig}
                    style={{ width: "100%", height: "100%" }}
                >
                    <Geographies geography={geoData}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const district =
                                    geo.properties.district ||
                                    geo.properties.DISTRICT ||
                                    geo.properties.name;
                                const count = districtData[district?.toUpperCase?.()] || 0;
                                const fillColor =
                                    count === 0
                                        ? "#e5e7eb"
                                        : showCircles
                                            ? "rgba(156, 163, 175, 0.45)"
                                            : colorScale(count);

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onMouseEnter={(e) => {
                                            setHoveredDistrict(district);
                                            setMousePosition({ x: e.clientX, y: e.clientY });
                                        }}
                                        onMouseMove={(e) => {
                                            setMousePosition({ x: e.clientX, y: e.clientY });
                                        }}
                                        onMouseLeave={() => setHoveredDistrict(null)}
                                        style={{
                                            default: {
                                                fill: fillColor,
                                                stroke: "#ffffff",
                                                strokeWidth: 1,
                                                outline: "none",
                                            },
                                            hover: {
                                                fill: "#2563eb",
                                                cursor: "pointer",
                                            },
                                            pressed: {
                                                fill: "#1d4ed8",
                                            },
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>

                    {showCircles &&
                        geoData.features.map((feature, index) => {
                            const district =
                                feature.properties.district ||
                                feature.properties.DISTRICT ||
                                feature.properties.name;

                            const key = district?.toUpperCase?.();
                            const count = districtData[key] || 0;
                            if (count === 0) return null;

                            const centroid = d3.geoCentroid(feature);
                            const radiusScale = d3Scale
                                .scaleSqrt()
                                .domain([minFraud, maxFraud])
                                .range([6, 20]);
                            const radius = radiusScale(count);

                            return (
                                <Marker key={index} coordinates={centroid}>
                                    <circle
                                        r={radius}
                                        fill="rgba(220, 38, 38, 0.6)"
                                        stroke="#7f1d1d"
                                        strokeWidth={0.9}
                                    />
                                </Marker>
                            );
                        })}
                </ComposableMap>
            </div>

            {!showCircles && (
                <div className="mt-1 px-5">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Low</span>
                        <div className="flex-1 h-3 mx-2 bg-gradient-to-r from-[#fee5d9] to-[#a50f15] rounded" />
                        <span>High</span>
                    </div>
                </div>
            )}

            {hoveredDistrict && (
                <div
                    className="pointer-events-none absolute z-50 px-3 py-2 rounded-xl bg-white border border-gray-300 shadow-lg"
                    style={{
                        top: mousePosition.y - 5,
                        left: mousePosition.x + 5,
                        minWidth: "180px",
                    }}
                >
                    <div className="text-sm font-semibold text-gray-800">
                        {hoveredDistrict}
                    </div>
                    <div className="text-sm text-red-600">
                        Fraud Reports: {districtData[hoveredDistrict?.toUpperCase?.()] || 0}
                    </div>
                </div>
            )}
        </div>
    );
}
