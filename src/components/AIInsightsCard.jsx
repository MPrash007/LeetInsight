import { Brain, TrendingUp, TrendingDown, Target, Lightbulb } from 'lucide-react';

function generateInsights(data) {
    const insights = [];
    const topics = data.topics || [];
    const strengths = topics.slice(0, 3).map(t => t.name);
    const weakTopics = [
        'Dynamic Programming', 'Graph', 'Tree', 'Backtracking', 'Binary Search',
        'Stack', 'Queue', 'Greedy', 'Trie', 'Segment Tree',
    ];
    const solvedTopicNames = new Set(topics.map(t => t.name));
    const weak = weakTopics.filter(t => !solvedTopicNames.has(t)).slice(0, 3);
    const lowSolved = topics.filter(t => t.count < 5).slice(0, 3).map(t => t.name);
    const actualWeak = weak.length > 0 ? weak : lowSolved;

    // Strength insights
    if (strengths.length > 0) {
        insights.push({
            type: 'strength',
            icon: TrendingUp,
            color: 'text-lc-easy',
            bg: 'bg-lc-easy/10',
            border: 'border-lc-easy/20',
            text: `You are strong in ${strengths.join(', ')} problems. Keep up the great work!`,
        });
    }

    // Weakness insights
    if (actualWeak.length > 0) {
        insights.push({
            type: 'weakness',
            icon: TrendingDown,
            color: 'text-lc-hard',
            bg: 'bg-lc-hard/10',
            border: 'border-lc-hard/20',
            text: `You should improve in ${actualWeak.join(', ')}. Focus on solving more problems in these areas.`,
        });
    }

    // Difficulty balance
    const total = data.totalSolved || 1;
    const easyPct = (data.easySolved / total) * 100;
    const mediumPct = (data.mediumSolved / total) * 100;
    const hardPct = (data.hardSolved / total) * 100;

    if (mediumPct < 30) {
        insights.push({
            type: 'tip',
            icon: Target,
            color: 'text-lc-medium',
            bg: 'bg-lc-medium/10',
            border: 'border-lc-medium/20',
            text: `Only ${mediumPct.toFixed(0)}% of your solutions are Medium problems. Focus on Medium to reach the next rating tier.`,
        });
    } else if (hardPct < 10) {
        insights.push({
            type: 'tip',
            icon: Target,
            color: 'text-lc-medium',
            bg: 'bg-lc-medium/10',
            border: 'border-lc-medium/20',
            text: `Try solving more Hard problems (currently ${hardPct.toFixed(0)}%). This will sharpen your competitive programming skills.`,
        });
    }

    // Contest insights
    if (data.contestHistory && data.contestHistory.length > 3) {
        const recent = data.contestHistory.slice(-5);
        const avgRecent = recent.reduce((sum, c) => sum + c.rating, 0) / recent.length;
        const older = data.contestHistory.slice(-10, -5);
        if (older.length > 0) {
            const avgOlder = older.reduce((sum, c) => sum + c.rating, 0) / older.length;
            if (avgRecent > avgOlder) {
                insights.push({
                    type: 'positive',
                    icon: TrendingUp,
                    color: 'text-lc-easy',
                    bg: 'bg-lc-easy/10',
                    border: 'border-lc-easy/20',
                    text: `Your contest rating shows consistent improvement! Recent average: ${Math.round(avgRecent)} vs earlier: ${Math.round(avgOlder)}.`,
                });
            } else {
                insights.push({
                    type: 'warning',
                    icon: Lightbulb,
                    color: 'text-lc-accent',
                    bg: 'bg-lc-accent/10',
                    border: 'border-lc-accent/20',
                    text: `Your recent contest performance has dipped. Consider practicing timed problems to regain momentum.`,
                });
            }
        }
    } else if (data.contestAttended === 0) {
        insights.push({
            type: 'tip',
            icon: Lightbulb,
            color: 'text-lc-accent',
            bg: 'bg-lc-accent/10',
            border: 'border-lc-accent/20',
            text: `You haven't participated in any contests yet. Join weekly contests to boost your competitive skills!`,
        });
    }

    // Recommended next topics
    const nextTopics = actualWeak.length > 0 ? actualWeak : ['Two Pointers', 'Sliding Window', 'Union Find'];
    insights.push({
        type: 'recommendation',
        icon: Lightbulb,
        color: 'text-lc-accent',
        bg: 'bg-lc-accent/10',
        border: 'border-lc-accent/20',
        text: `Recommended next topics: ${nextTopics.join(', ')}. Practice 2-3 problems daily in these areas.`,
    });

    return insights;
}

export default function AIInsightsCard({ data }) {
    const insights = generateInsights(data);

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lc-accent to-yellow-300 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-lc-bg" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-lc-text">AI Performance Analysis</h3>
                    <p className="text-xs text-lc-text-secondary">Insights generated from your coding data</p>
                </div>
            </div>

            <div className="space-y-3">
                {insights.map((insight, i) => {
                    const Icon = insight.icon;
                    return (
                        <div
                            key={i}
                            className={`flex items-start gap-3 p-4 rounded-xl ${insight.bg} border ${insight.border} transition-all duration-200 hover:scale-[1.01]`}
                        >
                            <Icon className={`w-5 h-5 ${insight.color} mt-0.5 flex-shrink-0`} />
                            <p className="text-sm text-lc-text leading-relaxed">{insight.text}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
