'use client'
import { useRouter } from "next/navigation";

const Reward = ({ campaignDetails }) => {
    const router = useRouter();
    if (!campaignDetails?.Rewards || campaignDetails.Rewards.length === 0) {
        return null;
    }

    return (
        <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Available Rewards</h2>
            <p className="text-sm text-gray-500 mb-4">Choose your support level and get exclusive rewards</p>
            <div className="space-y-4">
                {campaignDetails.Rewards.map((reward, index) => (
                    <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-xl flex flex-col gap-4 md:flex-row md:justify-between md:items-start"
                    >
                        {/* LEFT SECTION: Text content and button */}
                        <div className="flex-1 w-full">
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">{reward.Title}</h3>
                                    <a
                                        href="#"
                                        className="text-sm text-[#2357C6] font-medium block mt-1"
                                    >
                                        ${reward.Pricing}+ contribution
                                    </a>
                                </div>
                                {/* RIGHT SIDE: Available + Claimed */}
                                <div className="text-sm text-gray-500 text-right min-w-max pl-4">
                                    <p>{reward.Inventory} available</p>
                                    <p>{reward.RewardContributors?.length || 0} claimed</p>
                                </div>
                            </div>
                            <p className="text-sm text-[#1D2939] mt-2">{reward.Description}</p>

                            {/* Delivery + Button row */}
                            <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
                                <p className="text-sm text-[#475467]">
                                    Est. delivery: {reward.EstimatedDeliveryMonth}/{reward.EstimatedDeliveryYear}
                                </p>
                                <button onClick={() => router.push(`/reward/${reward.Id}`)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-100 whitespace-nowrap">
                                    Choose Reward
                                </button>
                            </div>

                        </div>
                    </div>

                ))}
            </div>
        </div>
    );
};
export default Reward;