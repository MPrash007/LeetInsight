import { useMemo } from 'react';
import { Flame, CalendarDays } from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const CELL_SIZE = 12;
const GAP = 2;
const LABEL_WIDTH = 28;

function getColor(count) {
    if (count === 0) return '#2a2a2a';
    if (count <= 2) return 'rgba(255,161,22,0.25)';
    if (count <= 5) return 'rgba(255,161,22,0.5)';
    if (count <= 10) return 'rgba(255,161,22,0.75)';
    return '#FFA116';
}

export default function Heatmap({ data }) {
    const calendarData = data.submissionCalendar || {};

    const { weeks, totalSubmissions, hasData } = useMemo(() => {
        // Build lookup map from calendar data
        const calMap = {};
        for (const [ts, count] of Object.entries(calendarData)) {
            calMap[Number(ts)] = count;
        }

        const now = new Date();
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);

        // Start from the beginning of the week (Sunday)
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

                    // Try multiple timestamp formats to match LeetCode's calendar
                    const midnightUTC = Date.UTC(y, m, day) / 1000;
                    const midnightLocal = new Date(y, m, day).getTime() / 1000;
                    const count = calMap[midnightUTC] || calMap[midnightLocal] || 0;
                    total += count;

                    week.push({
                        date: new Date(currentDate),
                        count,
                        month: m,
                    });
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

    // Compute month label positions based on first occurrence in each week's first visible day
    const monthLabels = useMemo(() => {
        const labels = [];
        let lastMonth = -1;
        weeks.forEach((week, wi) => {
            // Use the first non-null day of the week to determine the month
            const firstDay = week.find(d => d.date !== null);
            if (firstDay && firstDay.month !== lastMonth) {
                labels.push({ month: firstDay.month, weekIndex: wi });
                lastMonth = firstDay.month;
            }
        });
        return labels;
    }, [weeks]);

    const gridWidth = weeks.length * (CELL_SIZE + GAP);

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
                    <Flame className="w-4 h-4 text-lc-accent" />
                    <span className="text-lc-accent font-bold">{data.streak || 0}</span>
                    <span className="text-lc-text-secondary text-sm">day streak</span>
                </div>
            </div>

            {!hasData && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CalendarDays className="w-10 h-10 text-lc-text-secondary/30 mb-3" />
                    <p className="text-lc-text-secondary text-sm">
                        No recent submission activity available for this user.
                    </p>
                    <p className="text-lc-text-secondary/50 text-xs mt-1">
                        Submission data may not be public or the user hasn't submitted recently.
                    </p>
                </div>
            )}

            {hasData && (
                <div className="overflow-x-auto pb-2">
                    <div style={{ paddingLeft: LABEL_WIDTH, width: gridWidth + LABEL_WIDTH }}>
                        {/* Month labels — absolutely positioned above the grid */}
                        <div style={{ position: 'relative', height: 20, marginBottom: 4 }}>
                            {monthLabels.map(({ month, weekIndex }, i) => (
                                <span
                                    key={i}
                                    className="text-xs text-lc-text-secondary"
                                    style={{
                                        position: 'absolute',
                                        left: weekIndex * (CELL_SIZE + GAP),
                                    }}
                                >
                                    {MONTHS[month]}
                                </span>
                            ))}
                        </div>

                        {/* Grid with day labels */}
                        <div style={{ display: 'flex' }}>
                            {/* Day labels column */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: GAP,
                                marginRight: GAP,
                                marginLeft: -LABEL_WIDTH,
                                width: LABEL_WIDTH - GAP,
                            }}>
                                {DAYS.map((d, i) => (
                                    <span
                                        key={i}
                                        className="text-xs text-lc-text-secondary"
                                        style={{
                                            height: CELL_SIZE,
                                            lineHeight: `${CELL_SIZE}px`,
                                            textAlign: 'right',
                                            paddingRight: 4,
                                        }}
                                    >
                                        {d}
                                    </span>
                                ))}
                            </div>

                            {/* Week columns */}
                            {weeks.map((week, wi) => (
                                <div
                                    key={wi}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: GAP,
                                        marginRight: GAP,
                                    }}
                                >
                                    {week.map((day, di) => (
                                        <div
                                            key={di}
                                            style={{
                                                width: CELL_SIZE,
                                                height: CELL_SIZE,
                                                borderRadius: 2,
                                                backgroundColor: day.date ? getColor(day.count) : 'transparent',
                                                transition: 'background-color 0.2s',
                                                cursor: day.date ? 'pointer' : 'default',
                                            }}
                                            title={
                                                day.date
                                                    ? `${day.date.toLocaleDateString()}: ${day.count} submission${day.count !== 1 ? 's' : ''}`
                                                    : ''
                                            }
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-end gap-1 mt-3">
                            <span className="text-xs text-lc-text-secondary mr-1">Less</span>
                            {[
                                '#2a2a2a',
                                'rgba(255,161,22,0.25)',
                                'rgba(255,161,22,0.5)',
                                'rgba(255,161,22,0.75)',
                                '#FFA116',
                            ].map((c, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: CELL_SIZE,
                                        height: CELL_SIZE,
                                        borderRadius: 2,
                                        backgroundColor: c,
                                    }}
                                />
                            ))}
                            <span className="text-xs text-lc-text-secondary ml-1">More</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
