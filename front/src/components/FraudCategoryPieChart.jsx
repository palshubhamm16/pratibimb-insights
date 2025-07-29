// components/FraudCategoryPieChart.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = [
    "#2563eb", // blue-600
    "#059669", // emerald-600
    "#f59e0b", // amber-500
    "#dc2626", // red-600
    "#7c3aed", // violet-600
    "#0ea5e9", // sky-500
    "#f43f5e", // rose-500
    "#16a34a", // green-600
    "#d97706", // yellow-600
];

export default function FraudCategoryPieChart({ data }) {
    return (
        <div className="w-full p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">📊 Fraud Categories Distribution</h3>
            <ResponsiveContainer width="100%" height={450}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="count"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        label
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend
  layout="horizontal"
  verticalAlign="bottom"
  align="center"
  iconType="circle"
  content={({ payload }) => (
    <ul className="flex flex-wrap justify-center gap-4 text-xs">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-700">{entry.value}</span>
        </li>
      ))}
    </ul>
  )}
/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
