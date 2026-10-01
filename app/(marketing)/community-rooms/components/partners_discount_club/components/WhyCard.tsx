import Image from 'next/image';
import { StaticImageData } from 'next/image';

interface Props {
  image: string | StaticImageData;
  title: string;
  descriptionPoints: Array<string>;
}

const WhyCard: React.FC<Props> = ({ image, title, descriptionPoints }) => {
  return (
    <div className="border border-[#D8D9D9] bg-[#F8F8F8] rounded-xl p-[26px] small-500:px-4 small-500:py-5">
      <div className="relative size-[32px] small-500:size-[24px]">
        <Image
          src={image}
          alt="discount"
          fill
          className="object-contain"
        />
      </div>
      <div className="flex flex-col gap-3 small-500:mt-5 mt-8">
        <h6 className="text-blue-strong font-semibold text-[20px] ">
          {title}
        </h6>
        <ul className="text-[#5B657B] text-[20px] pl-8 font-medium list-disc marker:text-[#5B657B] flex flex-col gap-4">
          {descriptionPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default WhyCard;