import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', reports: 1000 },
  { month: 'Feb', reports: 1400 },
  { month: 'Mar', reports: 1800 },
  { month: 'Apr', reports: 1600 },
  { month: 'May', reports: 2000 },
  { month: 'Jun', reports: 1700 },
];

export default function TrendLineChart() {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold mb-2">Monthly Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="reports" stroke="#6366f1" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
