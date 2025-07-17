import { useParams } from "react-router-dom";
import StateMap from "../components/StateMap";

export default function StatePage() {
    const { stateName } = useParams();

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-center">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">{stateName}</h1>
            </div>
            <StateMap
                stateName="Maharashtra"
                districtData={{
                    "PUNE": 150,
                    "MUMBAI": 300,
                    "NAGPUR": 100,
                }}
            />


        </div>
    );
}
