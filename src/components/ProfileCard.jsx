import { User, Globe, Trophy, Star, Award } from 'lucide-react';

export default function ProfileCard({ data }) {
    const stats = [
        { icon: Globe, label: 'Global Ranking', value: data.ranking ? `#${data.ranking.toLocaleString()}` : 'N/A', color: 'text-lc-cyan' },
        { icon: Trophy, label: 'Contest Rating', value: data.contestRating || 'N/A', color: 'text-lc-accent' },
        { icon: Star, label: 'Reputation', value: data.reputation || 0, color: 'text-lc-pink' },
        { icon: Award, label: 'Contributions', value: data.contributionPoints || 0, color: 'text-lc-orange' },
    ];

    return (
        <div className="glass-card p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-lc-accent/30 bg-lc-card-hover">
                        {data.avatar ? (
                            <img
                                src={data.avatar}
                                alt={data.username}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User className="w-10 h-10 text-lc-text-secondary" />
                            </div>
                        )}
                    </div>
                    {data.streak > 0 && (
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-lc-accent to-lc-pink text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            🔥 {data.streak}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-lc-text">{data.username}</h1>
                    {data.realName && (
                        <p className="text-lc-text-secondary mt-1">{data.realName}</p>
                    )}

                    {/* Badges */}
                    {data.badges && data.badges.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                            {data.badges.slice(0, 5).map((badge, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-lc-accent/10 border border-lc-accent/20 text-lc-accent text-xs font-medium"
                                >
                                    {badge.icon && <img src={badge.icon} alt="" className="w-3.5 h-3.5" />}
                                    {badge.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {stats.map(({ icon: Icon, label, value, color }) => (
                    <div
                        key={label}
                        className="bg-lc-bg/50 rounded-xl p-4 text-center border border-lc-border hover:border-lc-accent/20 transition-colors"
                    >
                        <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
                        <p className="text-xl font-bold text-lc-text">{value}</p>
                        <p className="text-xs text-lc-text-secondary mt-1">{label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
