import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUser } from '../services/api';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import StatsCards from '../components/StatsCards';
import DifficultyChart from '../components/DifficultyChart';
import TopicChart from '../components/TopicChart';
import ContestChart from '../components/ContestChart';
import Heatmap from '../components/Heatmap';
import AIInsightsCard from '../components/AIInsightsCard';
import SkeletonLoader from '../components/SkeletonLoader';
import Footer from '../components/Footer';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function Dashboard() {
    const { platform = 'leetcode', username } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        setData(null);

        fetchUser(platform, username)
            .then((d) => {
                if (!cancelled) setData(d);
            })
            .catch((err) => {
                if (!cancelled) {
                    let msg = 'Failed to fetch data. Please check the username and try again.';
                    const apiError = err.response?.data?.error;

                    // Handle Vercel timeout/platform errors which return objects
                    if (typeof apiError === 'string') {
                        msg = apiError;
                    } else if (apiError && typeof apiError.message === 'string') {
                        msg = apiError.message;
                        if (apiError.code === '504' || msg.includes('TIMEOUT')) {
                            msg = `Request timed out. ${platform === 'codeforces' ? 'Codeforces' : 'LeetCode'} API might be slow. Please try again.`;
                        }
                    } else if (err.message) {
                        msg = err.message;
                    }

                    setError(msg);
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [username]);

    return (
        <div className="min-h-screen bg-lc-bg">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
                {/* Back button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-lc-text-secondary hover:text-lc-accent transition-colors mb-6 group"
                    id="back-button"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">Back to search</span>
                </button>

                {loading && <SkeletonLoader />}

                {error && (
                    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                        <div className="glass-card p-8 max-w-md text-center">
                            <AlertTriangle className="w-12 h-12 text-lc-hard mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-lc-text mb-2">Oops!</h2>
                            <p className="text-lc-text-secondary mb-6">{error}</p>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-lc-accent hover:bg-lc-accent-hover text-lc-bg font-semibold px-6 py-2.5 rounded-xl transition-all duration-200"
                            >
                                Try another username
                            </button>
                        </div>
                    </div>
                )}

                {data && (
                    <div className="animate-fade-in space-y-6">
                        {/* Profile */}
                        <ProfileCard data={data} />

                        {/* Stats Cards */}
                        <StatsCards data={data} />

                        {/* Charts Row 1 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <DifficultyChart data={data} />
                            <TopicChart data={data} />
                        </div>

                        {/* Contest Chart */}
                        <ContestChart data={data} />

                        {/* Heatmap */}
                        <Heatmap data={data} />

                        {/* AI Insights */}
                        <AIInsightsCard data={data} platform={platform} />
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
