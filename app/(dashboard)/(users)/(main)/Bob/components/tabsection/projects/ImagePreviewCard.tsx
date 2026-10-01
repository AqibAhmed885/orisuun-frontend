import Image from 'next/image';
import projectPreview from '../image.png';

const ImagePreviewCard = ({ img }: { img?: string | null }) => {
  const imageSrc = img || projectPreview;

  return (
    <div className="rounded-lg bg-[#F2F4F7] ">
      <Image
        src={imageSrc}
        alt="Project update preview"
        width={920}
        height={520}
        unoptimized={typeof imageSrc === 'string'}
        className="mx-auto h-[320px] w-full  rounded-lg object-cover"
      />
    </div>
  );
};

export default ImagePreviewCard;
