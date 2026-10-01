const RecentContibution = ({ campaignDetails }) => {
    if (!campaignDetails?.Contributions || campaignDetails.Contributions.length === 0) {
        return null;
    }

    return (
        <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Contributors</h2>
            <p className="text-sm text-gray-500 mb-4">Thank you to our amazing supporters</p>

            <div className="space-y-4">
                {campaignDetails.Contributions.slice(0, 2).map((contribution, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                {contribution.ProfilePicture ? (
                                    <img
                                        src={contribution.ProfilePicture}
                                        alt={contribution.Name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">{contribution.Name}</p>
                                <p className="text-sm text-gray-500">{contribution.Location}</p>
                            </div>
                        </div>
                        <p className="text-green-600 font-semibold text-sm">${contribution.Amount}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default RecentContibution;