import Image from 'next/image';
import Tag from './tag';

const WorkDescription = ({
  title,
  description,
  amount,
  status,
  expiryDate,
}: {
  title: string;
  description: string;
  amount?: string;
  status?: any;
  expiryDate?: string;
}) => (
  <div>
    <h6 className="text-h6 2xl:text-scaled-h6 font-semibold mb-3">{title}</h6>
    <p className="text-blue-400 font-medium text-h7 2xl:text-scaled-h7 mb-5">
      {description}
    </p>
    <div className="flex items-center gap-2 md:gap-4">
      {amount && (
        <p className="text-h8 2xl:text-scaled-h8 font-semibold text-blue-500">
          {amount}
        </p>
      )}
      {status && <Tag text={status} status={status} />}
      {expiryDate && (
        <div className="flex items-center gap-1">
          <Image
            src={'/images/vector/clock.svg'}
            alt=""
            width={24}
            height={24}
            className="md:w-6 md:h-6 w-4 h-4"
          />
          <p className="text-h7 2xl:text-scaled-h7 font-medium text-black-500">
            Expiry: {expiryDate}
          </p>
        </div>
      )}
    </div>
  </div>
);

export default WorkDescription;
