import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { state: 'Maharashtra', cases: 23000 },
  { state: 'Uttar Pradesh', cases: 18500 },
  { state: 'Tamil Nadu', cases: 16000 },
  { state: 'Delhi', cases: 14500 },
  { state: 'West Bengal', cases: 13000 },
  { state: 'Karnataka', cases: 12000 },
  { state: 'Rajasthan', cases: 11000 },
  { state: 'Gujarat', cases: 9500 },
  { state: 'Bihar', cases: 8700 },
  { state: 'Madhya Pradesh', cases: 8200 },
];

export default function TopStatesBarGraph() {
  return (
    <div className="w-full max-w-7xl bg-white rounded-2xl shadow p-6 mb-6 mx-auto">
      <h3 className="text-lg font-semibold mb-2">Top 10 Most Affected States</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={mockData}>
          <XAxis dataKey="state" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cases" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
