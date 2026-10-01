import Image from 'next/image';

const CampaignDetails = ({ campaignDetails }) => {
    return (
        <div className="max-w-sm bg-white rounded-lg dark:bg-gray-800 dark:border-gray-700">
            <Image
                className="rounded-xl w-full h-48 object-cover"
                src={campaignDetails?.BackgroundImage}
                alt="Campaign background"
                width={400}
                height={200}
            />
            <div className="p-2">
                <p className="text-center font-normal text-gray-700 dark:text-gray-400">
                    {campaignDetails?.Summary}
                </p>
            </div>
        </div>
    );
};
export default CampaignDetails;