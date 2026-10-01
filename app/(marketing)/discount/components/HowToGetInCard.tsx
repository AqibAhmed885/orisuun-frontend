import Image from 'next/image';
import { StaticImageData } from 'next/image';

interface Props {
  image: string | StaticImageData;
  title: string;
  description: string;
}

const HowToGetInCard: React.FC<Props> = ({ image, title, description }) => {
  return (
    <div className="flex flex-col gap-4 sm:items-center w-full sm:max-w-[405px] pr-4 pl-4 sm:pr-0 sm:pl-0">
      <Image className="w-full" width={380} height={190} src={image} alt={'how-to-get-card'} />
      <div className="flex flex-col gap-3 pr-3 pl-3 sm:max-w-[405px]">
        <h5 className="text-blue-strong text-base sm:text-2xl font-semibold">
          {title}
        </h5>
        <p className="text-gray-600 text-sm sm:text-xl ">
          {description}
        </p>
      </div>
    </div>
  )
}
export default HowToGetInCard;