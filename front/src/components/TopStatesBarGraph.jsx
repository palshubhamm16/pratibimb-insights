import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { district: 'Maharashtra', count: 23000 },
  { district: 'Uttar Pradesh', count: 18500 },
  { district: 'Tamil Nadu', count: 16000 },
  { district: 'Delhi', count: 14500 },
  { district: 'West Bengal', count: 13000 },
  { district: 'Karnataka', count: 12000 },
  { district: 'Rajasthan', count: 11000 },
  { district: 'Gujarat', count: 9500 },
  { district: 'Bihar', count: 8700 },
  { district: 'Madhya Pradesh', count: 8200 },
];
const minCount = data.length > 0 ? Math.min(...data.map(d => d.count)) : 0;

export default function TopStatesBarGraph() {
  return (
    <div className="w-full max-w-7xl bg-white rounded-2xl shadow p-6 mb-6 mx-auto">
      <h3 className="text-lg font-semibold mb-2">Top 10 Most Affected States</h3>
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
