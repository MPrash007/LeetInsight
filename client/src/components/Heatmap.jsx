import { useMemo } from 'react';
import { Flame, CalendarDays } from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const CELL_SIZE = 13;
const GAP = 3;

function getColor(count) {
    if (count === 0) return '#1E2338';
    if (count <= 2) return 'rgba(124,92,252,0.3)';
    if (count <= 5) return 'rgba(124,92,252,0.55)';
    if (count <= 10) return 'rgba(124,92,252,0.8)';
    return '#7C5CFC';
}

export default function Heatmap({ data }) {
    const calendarData = data.submissionCalendar || {};

    const { weeks, totalSubmissions, hasData } = useMemo(() => {
        const calMap = {};
        for (const [ts, count] of Object.entries(calendarData)) {
            calMap[Number(ts)] = count;
        }

        const now = new Date();
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);

        const startDate = new Date(oneYearAgo);
        startDate.setDate(startDate.getDate() - startDate.getDay());

        const weeks = [];
        let currentDate = new Date(startDate);
        let total = 0;

        while (currentDate <= now) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                if (currentDate > now) {
                    week.push({ date: null, count: 0, month: -1 });
                } else {
                    const y = currentDate.getFullYear();
                    const m = currentDate.getMonth();
                    const day = currentDate.getDate();
                    const midnightUTC = Date.UTC(y, m, day) / 1000;
                    const midnightLocal = new Date(y, m, day).getTime() / 1000;
                    const count = calMap[midnightUTC] || calMap[midnightLocal] || 0;
                    total += count;
                    week.push({ date: new Date(currentDate), count, month: m });
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            weeks.push(week);
        }

        return {
            weeks,
            totalSubmissions: total,
            hasData: total > 0 || Object.keys(calendarData).length > 0,
        };
    }, [calendarData]);

    const monthLabels = useMemo(() => {
        const labels = [];
        let lastMonth = -1;
        weeks.forEach((week, wi) => {
            const firstDay = week.find(d => d.date !== null);
            if (firstDay && firstDay.month !== lastMonth) {
                labels.push({ month: firstDay.month, weekIndex: wi });
                lastMonth = firstDay.month;
            }
        });
        return labels;
    }, [weeks]);

    const { offsets, totalWidth } = useMemo(() => {
        let currentOffset = 0;
        const o = [];
        weeks.forEach((week, wi) => {
            const isNewMonth = wi > 0 && monthLabels.some(l => l.weekIndex === wi);
            if (isNewMonth) currentOffset += 6;
            o.push(currentOffset);
            currentOffset += CELL_SIZE + GAP;
        });
        return { offsets: o, totalWidth: currentOffset };
    }, [weeks, monthLabels]);

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-lc-text">Submission Activity</h3>
                    <p className="text-sm text-lc-text-secondary mt-1">
                        {totalSubmissions.toLocaleString()} submissions in the last year
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-lc-pink" />
                    <span className="text-lc-pink font-bold">{data.streak || 0}</span>
                    <span className="text-lc-text-secondary text-sm">day streak</span>
                </div>
            </div>

            {!hasData && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CalendarDays className="w-10 h-10 text-lc-text-secondary/30 mb-3" />
                    <p className="text-lc-text-secondary text-sm">No recent submission activity available for this user.</p>
                    <p className="text-lc-text-secondary/50 text-xs mt-1">Submission data may not be public or the user hasn't submitted recently.</p>
                </div>
            )}

            {hasData && (
                <div className="overflow-x-auto pb-2 flex justify-center">
                    <div style={{ width: totalWidth }}>
                        
                        <div style={{ display: 'flex' }}>
                            {weeks.map((week, wi) => {
                                const isNewMonth = wi > 0 && monthLabels.some(l => l.weekIndex === wi);
                                return (
                                <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: GAP, marginRight: GAP, marginLeft: isNewMonth ? 6 : 0 }}>
                                    {week.map((day, di) => (
                                        <div key={di} style={{ width: CELL_SIZE, height: CELL_SIZE, borderRadius: 2, backgroundColor: day.date ? getColor(day.count) : 'transparent', transition: 'background-color 0.2s', cursor: day.date ? 'pointer' : 'default' }}
                                            title={day.date ? `${day.date.toLocaleDateString()}: ${day.count} submission${day.count !== 1 ? 's' : ''}` : ''} />
                                    ))}
                                </div>
                                );
                            })}
                        </div>

                        <div style={{ position: 'relative', height: 20, marginTop: 8 }}>
                            {monthLabels.map(({ month, weekIndex }, i) => (
                                <span key={i} className="text-xs text-lc-text-secondary" style={{ position: 'absolute', left: offsets[weekIndex] }}>
                                    {MONTHS[month]}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-end gap-1 mt-3">
                            <span className="text-xs text-lc-text-secondary mr-1">Less</span>
                            {['#1E2338', 'rgba(124,92,252,0.3)', 'rgba(124,92,252,0.55)', 'rgba(124,92,252,0.8)', '#7C5CFC'].map((c, i) => (
                                <div key={i} style={{ width: CELL_SIZE, height: CELL_SIZE, borderRadius: 2, backgroundColor: c }} />
                            ))}
                            <span className="text-xs text-lc-text-secondary ml-1">More</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
