import { CheckCircle2 } from 'lucide-react';

function ProgressBar({ value, max, color }) {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
        <div className="progress-bar mt-2">
            <div
                className="progress-bar-fill"
                style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                }}
            />
        </div>
    );
}

export default function StatsCards({ data }) {
    const difficulties = [
        {
            label: 'Easy',
            solved: data.easySolved,
            total: data.totalEasy,
            color: '#00B8A3',
            bg: 'bg-lc-easy/10',
            border: 'border-lc-easy/20',
        },
        {
            label: 'Medium',
            solved: data.mediumSolved,
            total: data.totalMedium,
            color: '#FFC01E',
            bg: 'bg-lc-medium/10',
            border: 'border-lc-medium/20',
        },
        {
            label: 'Hard',
            solved: data.hardSolved,
            total: data.totalHard,
            color: '#FF375F',
            bg: 'bg-lc-hard/10',
            border: 'border-lc-hard/20',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Solved */}
            <div className="glass-card-hover p-5">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-lc-accent/10 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-lc-accent" />
                    </div>
                    <div>
                        <p className="text-xs text-lc-text-secondary">Total Solved</p>
                        <p className="text-2xl font-bold text-lc-text">{data.totalSolved}</p>
                    </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                    <span className="text-lc-text-secondary">of {data.totalAll} problems</span>
                    <span className="text-lc-accent font-medium">{data.acceptanceRate}% rate</span>
                </div>
                <ProgressBar value={data.totalSolved} max={data.totalAll} color="#FFA116" />
            </div>

            {/* Difficulty Cards */}
            {difficulties.map(({ label, solved, total, color, bg, border }) => (
                <div key={label} className="glass-card-hover p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center border ${border}`}>
                            <span className="text-sm font-bold" style={{ color }}>{label[0]}</span>
                        </div>
                        <div>
                            <p className="text-xs text-lc-text-secondary">{label}</p>
                            <p className="text-2xl font-bold text-lc-text">{solved}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-lc-text-secondary">of {total}</span>
                        <span style={{ color }} className="font-medium">
                            {total > 0 ? ((solved / total) * 100).toFixed(1) : 0}%
                        </span>
                    </div>
                    <ProgressBar value={solved} max={total} color={color} />
                </div>
            ))}
        </div>
    );
}
