import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BarChart3, Trophy, TrendingUp, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const exampleUsers = ['neal_wu', 'tourist', 'uwi', 'errichto', 'jiangly'];

export default function Home() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (username.trim()) {
            navigate(`/user/${username.trim()}`);
        }
    };

    return (
        <div className="min-h-screen bg-lc-bg">
            <Navbar />

            {/* Hero Section */}
            <main className="flex flex-col items-center justify-center px-4 pt-32 pb-20">
                {/* Badge */}
                <div className="animate-fade-in mb-6">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lc-accent/10 border border-lc-accent/20 text-lc-accent text-sm font-medium">
                        <Zap className="w-4 h-4" />
                        Free LeetCode Analytics
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-extrabold text-center mb-6 animate-fade-in">
                    <span className="text-lc-text">Analyze Your</span>
                    <br />
                    <span className="gradient-text">LeetCode Journey</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lc-text-secondary text-lg md:text-xl text-center max-w-2xl mb-10 animate-fade-in text-balance">
                    Unlock powerful insights into your coding progress. Visualize your strengths,
                    track contest performance, and get AI-powered improvement tips.
                </p>

                {/* Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="w-full max-w-xl animate-slide-up"
                >
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-lc-accent via-lc-pink to-lc-cyan rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-sm" />
                        <div className="relative flex items-center bg-lc-card border border-lc-border rounded-2xl overflow-hidden">
                            <Search className="w-5 h-5 text-lc-text-secondary ml-5" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter LeetCode username..."
                                className="flex-1 bg-transparent text-lc-text px-4 py-4 text-lg outline-none placeholder:text-lc-text-secondary/50"
                                id="username-search"
                            />
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-lc-accent to-lc-pink hover:opacity-90 text-white font-semibold px-6 py-3 mr-1.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-lc-accent/20"
                                id="search-button"
                            >
                                Analyze
                            </button>
                        </div>
                    </div>
                </form>

                {/* Example Users */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2 animate-slide-up">
                    <span className="text-lc-text-secondary text-sm mr-1">Try:</span>
                    {exampleUsers.map((user) => (
                        <button
                            key={user}
                            onClick={() => navigate(`/user/${user}`)}
                            className="px-3 py-1 rounded-lg bg-lc-card border border-lc-border text-lc-text-secondary text-sm hover:text-lc-accent hover:border-lc-accent/30 transition-all duration-200"
                        >
                            {user}
                        </button>
                    ))}
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mt-24 px-4">
                    {[
                        {
                            icon: BarChart3,
                            title: 'Visual Analytics',
                            desc: 'Interactive charts showing your problem-solving distribution, topic strengths, and progress.',
                            color: 'from-lc-accent to-purple-400',
                            iconColor: 'text-lc-accent',
                        },
                        {
                            icon: Trophy,
                            title: 'Contest Insights',
                            desc: 'Track your contest rating history, ranking, and compare performance over time.',
                            color: 'from-lc-cyan to-blue-400',
                            iconColor: 'text-lc-cyan',
                        },
                        {
                            icon: TrendingUp,
                            title: 'AI Recommendations',
                            desc: 'Get personalized suggestions on which topics to focus on to improve your skills.',
                            color: 'from-lc-pink to-rose-400',
                            iconColor: 'text-lc-pink',
                        },
                    ].map(({ icon: Icon, title, desc, color, iconColor }) => (
                        <div
                            key={title}
                            className="glass-card-hover p-6 flex flex-col items-center text-center"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} bg-opacity-10 flex items-center justify-center mb-4`}
                                style={{ background: `linear-gradient(135deg, rgba(124,92,252,0.15), rgba(0,212,255,0.1))` }}>
                                <Icon className={`w-6 h-6 ${iconColor}`} />
                            </div>
                            <h3 className="text-lc-text font-semibold text-lg mb-2">{title}</h3>
                            <p className="text-lc-text-secondary text-sm leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
