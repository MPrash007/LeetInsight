export default function SkeletonLoader() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Profile skeleton */}
            <div className="glass-card p-8">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl skeleton" />
                    <div className="flex-1 space-y-3">
                        <div className="h-7 w-48 skeleton rounded" />
                        <div className="h-4 w-32 skeleton rounded" />
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 skeleton rounded-xl" />
                    ))}
                </div>
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="glass-card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl skeleton" />
                            <div className="space-y-2">
                                <div className="h-3 w-16 skeleton rounded" />
                                <div className="h-6 w-12 skeleton rounded" />
                            </div>
                        </div>
                        <div className="h-2 skeleton rounded-full mt-3" />
                    </div>
                ))}
            </div>

            {/* Charts skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <div className="h-5 w-40 skeleton rounded mb-4" />
                    <div className="h-72 skeleton rounded-xl" />
                </div>
                <div className="glass-card p-6">
                    <div className="h-5 w-40 skeleton rounded mb-4" />
                    <div className="h-72 skeleton rounded-xl" />
                </div>
            </div>

            {/* Larger charts skeleton */}
            <div className="glass-card p-6">
                <div className="h-5 w-48 skeleton rounded mb-4" />
                <div className="h-72 skeleton rounded-xl" />
            </div>
        </div>
    );
}
