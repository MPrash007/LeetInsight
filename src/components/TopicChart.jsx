import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const BAR_COLOR = '#FFA116';

function CustomTooltip({ active, payload, label }) {
    if (active && payload?.[0]) {
        return (
            <div className="bg-lc-card border border-lc-border rounded-lg px-3 py-2 shadow-xl">
                <p className="text-sm font-medium text-lc-text">{label}</p>
                <p className="text-sm text-lc-text-secondary">
                    Solved: <span className="text-lc-text font-semibold">{payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
}

export default function TopicChart({ data }) {
    const topics = (data.topics || []).slice(0, 12);

    if (topics.length === 0) return null;

    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-lc-text mb-4">Top Topics</h3>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topics} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" horizontal={false} />
                        <XAxis type="number" stroke="#666" fontSize={12} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#666"
                            fontSize={11}
                            width={100}
                            tick={{ fill: '#B3B3B3' }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,161,22,0.05)' }} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20}>
                            {topics.map((_, i) => (
                                <Cell key={i} fill={i === 0 ? '#FFA116' : i < 3 ? '#FFB84D' : '#665526'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
