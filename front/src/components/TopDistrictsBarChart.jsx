import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function TopDistrictsBarChart({ data }) {
    // Find minimum count value (fallback to 0 if data is empty)
    const minCount = data.length > 0 ? Math.min(...data.map(d => d.count)) : 0;

    return (
        <div className="w-full max-w-7xl p-2 mx-auto bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Top 10 Districts by Case Count</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <XAxis dataKey="district" />
                    <YAxis domain={[(minCount - 1), 'auto']} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#ef4444" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
