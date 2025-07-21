// components/FraudCategoryPieChart.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

export default function FraudCategoryPieChart({ data }) {
    return (
        <div className="w-full p-2 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Fraud Categories Distribution</h3>
            <ResponsiveContainer width="100%" height={428}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="count"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={130}
                        label
                    >
                        {data.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
