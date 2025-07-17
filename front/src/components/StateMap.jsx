import { useEffect, useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
} from "react-simple-maps";
import { feature } from "topojson-client";

// Loader map for all states
const geojsonMap = {
    andamannicobar: () => import("../data/state/andamannicobar.json"),
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

// Custom scale & center per state (can be tuned further)
export const stateProjectionMap = {
    andamannicobar: { center: [92.62, 10.45], scale: 2000 },
    andhrapradesh: { center: [80.64, 15.91], scale: 3800 },
    arunachalpradesh: { center: [94.72, 28.2], scale: 5000 },
    assam: { center: [92.93, 26.2], scale: 6000 },
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
    kerala: { center: [76.3, 10.5], scale: 3000 },
    ladakh: { center: [77.1, 34.3], scale: 2800 },
    lakshadweep: { center: [72.0, 10.5], scale: 4000 },
    madhyapradesh: { center: [78.4, 23.4], scale: 1500 },
    maharashtra: { center: [75.7, 19.5], scale: 1600 },
    manipur: { center: [93.9, 24.7], scale: 3000 },
    meghalaya: { center: [91.6, 25.5], scale: 3000 },
    mizoram: { center: [92.9, 23.3], scale: 3000 },
    nagaland: { center: [94.2, 26.1], scale: 3000 },
    odisha: { center: [84.6, 20.3], scale: 2000 },
    puducherry: { center: [79.8, 11.9], scale: 5000 },
    punjab: { center: [75.3, 31.1], scale: 6000 },
    rajasthan: { center: [73.8, 27.0], scale: 1300 },
    sikkim: { center: [88.5, 27.5], scale: 5000 },
    tamilnadu: { center: [78.6, 10.5], scale: 3000 },
    telangana: { center: [79.1, 17.5], scale: 2000 },
    tripura: { center: [91.5, 23.9], scale: 3000 },
    uttarakhand: { center: [79.0, 30.1], scale: 2500 },
    uttarpradesh: { center: [80.9, 26.8], scale: 2500 },
    westbengal: { center: [87.8, 23.5], scale: 4200 },
    default: { center: [78.9, 22.0], scale: 1500 },
};


export default function StateMap({ stateName }) {
    const [geoData, setGeoData] = useState(null);
    const [hoveredDistrict, setHoveredDistrict] = useState(null);

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

    return (
        <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-4 text-center">
                District-wise Heatmap – {stateName}
            </h2>

            <div style={{ width: "100%", height: "600px", overflow: "hidden" }}>
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

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onMouseEnter={() => setHoveredDistrict(district)}
                                        onMouseLeave={() => setHoveredDistrict(null)}
                                        style={{
                                            default: {
                                                fill: "#93c5fd",
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
                </ComposableMap>
            </div>

            {hoveredDistrict && (
                <div className="mt-4 text-center">
                    <p className="text-md font-medium text-gray-700">
                        District: {hoveredDistrict}
                    </p>
                    <p className="text-sm text-gray-500">Mock Reports: N/A</p>
                </div>
            )}
        </div>
    );
}
