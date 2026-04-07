import { Link, useLocation } from 'react-router-dom';
import { Code2 } from 'lucide-react';

export default function Navbar() {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/user/');

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-lc-bg/80 backdrop-blur-xl border-b border-lc-border/50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-lc-accent flex items-center justify-center group-hover:shadow-lg group-hover:shadow-lc-accent/20 transition-shadow">
                        <Code2 className="w-5 h-5 text-lc-bg" />
                    </div>
                    <span className="text-xl font-bold text-lc-text">
                        Leet<span className="text-lc-accent">Insight</span>
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {isDashboard && (
                        <Link
                            to="/"
                            className="text-sm text-lc-text-secondary hover:text-lc-accent transition-colors"
                        >
                            New Search
                        </Link>
                    )}
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-lc-text-secondary hover:text-lc-text transition-colors"
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </nav>
    );
}
