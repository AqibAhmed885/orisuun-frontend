const CampaignUpdates = ({ campaignDetails }) => {
    console.log('Campaign Details in Updates:', campaignDetails);
    // This would ideally come from API, but since it's not in the sample data,
    // we'll create some sample updates based on the campaign data
    const updates = [
        {
            title: `$${campaignDetails?.Achieved} Raised So Far`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            description: `Thank you to all ${campaignDetails?.Contributions?.length} supporters who helped us reach this milestone!`
        },
        {
            title: 'Campaign Launched',
            date: new Date(campaignDetails?.CreatedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            description: 'Our fundraising campaign is now live! Help us reach our goal.'
        }
    ];

    return (
        <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mt-3">
            <h2 className="text-lg font-semibold text-gray-900">Campaign Updates</h2>
            <p className="text-sm text-gray-500 mb-4">Latest progress and milestones</p>
            <div className="space-y-3">
                {updates.map((update, index) => (
                    <div key={index} className="p-4 border border-[#BFD2FB] rounded-lg">
                        <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-gray-900">{update.title}</h3>
                            <span className="text-sm text-gray-500">{update.date}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{update.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CampaignUpdates;