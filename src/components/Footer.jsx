import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-lc-border/50 py-8 mt-12">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-lc-text-secondary text-sm flex items-center gap-1">
                    Built with <Heart className="w-3.5 h-3.5 text-lc-hard fill-lc-hard" /> by LeetInsight
                </p>
                <p className="text-lc-text-secondary/50 text-xs">
                    Data sourced from LeetCode. Not affiliated with LeetCode.
                </p>
            </div>
        </footer>
    );
}
