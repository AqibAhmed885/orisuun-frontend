import { useCampaignDetails } from './context/campaign-context';
import DOMPurify from 'dompurify';

const Details = ({ className }) => {
  const { campaignInfo } = useCampaignDetails();

  return (
    <div className={`pt-7 ${className}`}>
      <h1 className="text-h1 font-semibold mb-7">Campaign Details</h1>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            campaignInfo.CampaignDetails.replaceAll(
              '<li><p>',
              '<li>'
            ).replaceAll('</p></li>', '</li>')
          ),
        }}
        className="flex flex-col break-all gap-5 campaignDetailsContent"
      ></div>
    </div>
  );
};

export default Details;
