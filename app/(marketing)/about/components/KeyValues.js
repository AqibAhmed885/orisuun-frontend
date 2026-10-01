import Image from 'next/image';

export const KeyValues = () => {
  const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

  return (
    <section id="key-values" className="px-4 md:px-20 lg:pb-[200px] py-[120px] md:py-[150px] space-y-[60px]">
      <h4 className="text-blue-strong text-[40px] leading-[44px] text-center font-semibold">
        Our key values
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:gap-8 gap-6 mx-auto ">
        <div className="bg-[#F2F7FC] rounded-[12px] max-h-[354px] w-full md:max-w-[405px] p-8 flex flex-col justify-center items-center mx-auto md:mx-0">
          <p className="text-blue-strong text-[20px] sm:text-[24px] leading-[36px] font-semibold text-center md:text-left">
            Transparency
          </p>
          <Image
            src={`${staticUrl}/about/images/transparency.svg`}
            alt="transparency"
            width={300}
            height={194}
          />
        </div>
        <div className="bg-[#F2F7FC] rounded-[12px] max-h-[354px] w-full md:max-w-[405px] p-8 flex flex-col justify-center items-center mx-auto md:mx-0">
          <p className="text-blue-strong text-[20px] sm:text-[24px] leading-[36px] font-semibold text-center md:text-left">
            Integrity
          </p>
          <Image
            src={`${staticUrl}/about/images/integrity.svg`}
            alt="integrity"
            width={300}
            height={194}
          />
        </div>
        <div className="bg-[#F2F7FC] rounded-[12px] max-h-[354px] w-full md:max-w-[405px] p-8 flex flex-col justify-center items-center mx-auto md:mx-0">
          <p className="text-blue-strong text-[20px] sm:text-[24px] leading-[36px] font-semibold text-center md:text-left">
            Professionalism
          </p>
          <Image
            src={`${staticUrl}/about/images/professionalism.svg`}
            alt="professionalism"
            width={300}
            height={194}
          />
        </div>
      </div>
    </section>
  );
};
