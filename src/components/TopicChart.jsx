import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

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

const COLORS = ['#7C5CFC', '#E91E8C', '#00D4FF', '#FF6B35', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4', '#F472B6', '#A78BFA', '#34D399', '#FB923C'];

export default function TopicChart({ data }) {
    const topics = (data.topics || []).slice(0, 12);

    if (topics.length === 0) return null;

    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-lc-text mb-4">Top Topics</h3>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topics} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E2338" horizontal={false} />
                        <XAxis type="number" stroke="#3D4460" fontSize={12} tick={{ fill: '#8B8FA3' }} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#3D4460"
                            fontSize={11}
                            width={100}
                            tick={{ fill: '#8B8FA3' }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,92,252,0.05)' }} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20}>
                            {topics.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
