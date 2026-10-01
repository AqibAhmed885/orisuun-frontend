const Fundraising = ({ campaignDetails }) => {
    const percentageRaised = Math.round((campaignDetails?.Achieved / campaignDetails?.Goal) * 100);
    const daysLeft = Math.ceil((new Date(campaignDetails?.Duration as string).getTime() - Date.now()) / (1000 * 60 * 60 * 24));


    return (
        <div className='bg-[#F5F8FF] p-5 rounded-xl border border-gray-[#EAECF0] shadow-sm'>
            <div className="">
                <h3 className="text-lg font-semibold text-gray-800">{campaignDetails?.Title}</h3>
                <h4 className="text-lg font-medium text-gray-700 mt-1">{campaignDetails?.Purpose}</h4>
                <p className="mt-2 text-gray-600">
                    {campaignDetails?.Summary}
                </p>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className='bg-white border-2 border-[#759EF7] flex flex-col items-center justify-center p-2 rounded-lg shadow-sm'>
                    <p className="text-xl font-semibold text-gray-800">${campaignDetails?.Achieved}</p>
                    <p className="text-gray-600">Raised</p>
                </div>
                <div className='bg-white border-2 border-[#759EF7] flex flex-col items-center justify-center p-2 rounded-lg shadow-sm'>
                    <p className="text-xl font-semibold text-[#2357C6]">{campaignDetails?.Contributions?.length}</p>
                    <p className="text-gray-600">Supporters</p>
                </div>
                <div className='bg-white border-2 border-[#759EF7] flex flex-col items-center justify-center p-2 rounded-lg shadow-sm'>
                    <p className="text-xl font-semibold text-gray-800">{daysLeft}</p>
                    <p className="text-gray-600">Days Left</p>
                </div>
                <div className='bg-white border-2 border-[#759EF7] flex flex-col items-center justify-center p-2 rounded-lg shadow-sm'>
                    <p className="text-xl font-semibold text-gray-800">
                        {new Date(campaignDetails?.CreatedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-gray-600">Started</p>
                </div>
            </div>

            <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>${campaignDetails?.Achieved} raised of ${campaignDetails?.Goal} goal</span>
                    <span className='text-black font-semibold'>{percentageRaised}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                        className="bg-[#152F66] h-2.5 rounded-full"
                        style={{ width: `${percentageRaised}%` }}
                    ></div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 mt-6">
                <button className="w-full md:w-1/2 px-6 py-3 bg-[#2357C6] hover:bg-[#658ce0] text-white font-semibold rounded-md transition-colors">
                    Support this Campaign
                </button>
                <button className="w-full md:w-1/2 px-6 py-3 bg-white hover:bg-[#f0f4ff] text-[#344054] font-semibold border border-[#D0D5DD] rounded-md transition-colors">
                    Share Campaign
                </button>
            </div>
        </div>
    );
};

export default Fundraising;