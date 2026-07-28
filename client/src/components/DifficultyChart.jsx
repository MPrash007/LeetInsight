import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

function CustomTooltip({ active, payload }) {
    if (active && payload?.[0]) {
        return (
            <div className="bg-lc-card border border-lc-border rounded-lg px-3 py-2 shadow-xl">
                <p className="text-sm font-medium text-lc-text">{payload[0].name}</p>
                <p className="text-sm text-lc-text-secondary">
                    Solved: <span className="text-lc-text font-semibold">{payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
}

export default function DifficultyChart({ data }) {
    const chartData = [
        { name: 'Easy', value: data.easySolved },
        { name: 'Medium', value: data.mediumSolved },
        { name: 'Hard', value: data.hardSolved },
    ].filter(d => d.value > 0);

    if (chartData.length === 0) return null;

    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-lc-text mb-4">Difficulty Distribution</h3>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            formatter={(value) => (
                                <span className="text-sm text-lc-text-secondary">{value}</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
