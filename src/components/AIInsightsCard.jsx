import { useState } from 'react';
import { Brain, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateInsights } from '../services/api';

export default function AIInsightsCard({ data, platform = 'leetcode' }) {
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await generateInsights(data, platform);
            setInsight(result.insight);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to generate AI insights.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-6 flex flex-col items-start min-h-[250px]">
            <div className="flex items-center gap-3 mb-6 w-full">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lc-accent to-lc-pink flex flex-shrink-0 items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-lc-text">Gemini AI Analysis</h3>
                    <p className="text-xs text-lc-text-secondary">Get deep, personalized progression advice</p>
                </div>
                {!insight && !loading && (
                    <button
                        onClick={handleGenerate}
                        className="bg-lc-accent/10 hover:bg-lc-accent/20 border border-lc-accent/30 text-lc-accent flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-semibold whitespace-nowrap"
                    >
                        <Sparkles className="w-4 h-4" />
                        Generate Analysis
                    </button>
                )}
            </div>

            {loading && (
                <div className="flex-1 w-full flex flex-col items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-lc-pink animate-spin mb-3" />
                    <p className="text-lc-text-secondary text-sm animate-pulse text-center">
                        Synthesizing coding patterns...<br/>
                        Analyzing weaknesses...
                    </p>
                </div>
            )}

            {error && !loading && (
                <div className="flex-1 w-full flex flex-col items-center justify-center py-6 bg-lc-hard/5 border border-lc-hard/20 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-lc-hard mb-2" />
                    <p className="text-sm text-lc-text-secondary text-center px-4">{error}</p>
                    <button onClick={handleGenerate} className="mt-4 text-lc-hard text-xs font-semibold hover:underline">
                        Try Again
                    </button>
                </div>
            )}

            {insight && !loading && (
                <div className="w-full prose prose-invert prose-sm max-w-none 
                    prose-p:text-lc-text-secondary prose-p:leading-relaxed 
                    prose-strong:text-lc-text prose-strong:font-semibold 
                    prose-ul:text-lc-text-secondary prose-li:my-1
                    prose-headings:text-lc-text prose-headings:font-semibold">
                    <ReactMarkdown>{insight}</ReactMarkdown>
                </div>
            )}

            {!insight && !loading && !error && (
                <div className="flex-1 w-full flex flex-col items-center justify-center py-8">
                    <p className="text-lc-text-secondary text-sm text-center max-w-sm">
                        Click the button above to generate a unique AI analysis of your {platform === 'codeforces' ? 'Codeforces' : 'LeetCode'} profile using Gemini. 
                        It will highlight your strengths and recommend exact topics to practice next!
                    </p>
                </div>
            )}
        </div>
    );
}
