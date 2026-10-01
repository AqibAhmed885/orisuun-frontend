export const ResourceLoader = () => (
    <div className="w-full py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1440px] mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-pulse flex flex-col justify-between min-h-[360px]">
                    {/* Header: title, small badge */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="h-8 bg-gray-200 rounded w-56 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded-full w-24 flex items-center justify-center"></div>
                    </div>

                    {/* Organization & location */}
                    <div className="mt-6 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>

                    {/* Dates / meta lines */}
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-6 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>

                    {/* Eligibility box and CTA */}
                    <div className="mt-6">
                        <div className="bg-gray-100 rounded-lg p-4">
                            <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>

                        <div className="mt-4">
                            <div className="h-12 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);