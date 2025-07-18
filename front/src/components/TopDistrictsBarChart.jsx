// components/TopDistrictsBarChart.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function TopDistrictsBarChart({ data }) {
    return (
        <div className="w-full max-w-7xl p-2 mx-auto bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Top 10 Districts by Case Count</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <XAxis dataKey="district" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#ef4444" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
