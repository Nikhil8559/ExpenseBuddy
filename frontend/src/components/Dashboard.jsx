import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981",
  "#3b82f6", "#ef4444", "#14b8a6", "#f97316", "#84cc16",
];

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Dashboard({ summary }) {
  if (!summary) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-400 text-sm">
        Loading summary…
      </div>
    );
  }

  const { month, total, breakdown } = summary;

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Monthly Overview</h2>
        <span className="text-sm text-gray-500">{month}</span>
      </div>

      <div className="bg-indigo-50 rounded-xl px-5 py-4 flex items-center justify-between">
        <span className="text-sm font-medium text-indigo-700">Total Spent</span>
        <span className="text-2xl font-bold text-indigo-700">₹{total.toFixed(2)}</span>
      </div>

      {breakdown.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-4">
          No expenses this month yet.
        </p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={breakdown}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={renderCustomLabel}
              >
                {breakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => [`₹${v.toFixed(2)}`, "Amount"]}
                contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ fontSize: "12px", color: "#374151" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-2">
            {breakdown.map((item, i) => (
              <div key={item.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-gray-600">{item.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-xs">
                    {total > 0 ? ((item.total / total) * 100).toFixed(1) : 0}%
                  </span>
                  <span className="font-medium text-gray-800">₹{item.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
