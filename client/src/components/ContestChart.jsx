import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

function CustomTooltip({ active, payload }) {
    if (active && payload?.[0]) {
        const d = payload[0].payload;
        return (
            <div className="bg-lc-card border border-lc-border rounded-lg px-4 py-3 shadow-xl">
                <p className="text-sm font-medium text-lc-text mb-1">{d.title}</p>
                <p className="text-sm text-lc-text-secondary">
                    Rating: <span className="text-lc-cyan font-semibold">{d.rating}</span>
                </p>
                <p className="text-xs text-lc-text-secondary mt-1">
                    Rank: #{d.ranking?.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
}

export default function ContestChart({ data }) {
    const history = data.contestHistory || [];

    if (history.length === 0) {
        return (
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-lc-text mb-2">Contest Rating History</h3>
                <p className="text-lc-text-secondary text-sm">No contest data available.</p>
            </div>
        );
    }

    const chartData = history.map((c, i) => ({
        index: i + 1,
        title: c.title,
        rating: c.rating,
        ranking: c.ranking,
    }));

    const minRating = Math.min(...chartData.map(d => d.rating)) - 50;
    const maxRating = Math.max(...chartData.map(d => d.rating)) + 50;

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-lc-text">Contest Rating History</h3>
                    <p className="text-sm text-lc-text-secondary mt-1">
                        {data.contestAttended} contests attended
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-lc-accent/10 border border-lc-accent/20 rounded-xl px-4 py-2">
                    <TrendingUp className="w-4 h-4 text-lc-accent" />
                    <span className="text-lc-accent font-bold text-lg">{data.contestRating}</span>
                    {data.contestTopPercentage && (
                        <span className="text-lc-text-secondary text-xs ml-1">
                            Top {data.contestTopPercentage}%
                        </span>
                    )}
                </div>
            </div>

            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                                <stop offset="50%" stopColor="#7C5CFC" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#E91E8C" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#00D4FF" />
                                <stop offset="50%" stopColor="#7C5CFC" />
                                <stop offset="100%" stopColor="#E91E8C" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E2338" />
                        <XAxis
                            dataKey="index"
                            stroke="#3D4460"
                            fontSize={12}
                            tick={{ fill: '#8B8FA3' }}
                            label={{ value: 'Contest #', position: 'insideBottom', offset: -5, fill: '#8B8FA3', fontSize: 12 }}
                        />
                        <YAxis
                            domain={[minRating, maxRating]}
                            stroke="#3D4460"
                            fontSize={12}
                            tick={{ fill: '#8B8FA3' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="rating"
                            stroke="#7C5CFC"
                            strokeWidth={2}
                            fill="url(#ratingGradient)"
                            dot={{ r: 2, fill: '#7C5CFC', strokeWidth: 0 }}
                            activeDot={{ r: 5, fill: '#00D4FF', stroke: '#0B0F19', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
