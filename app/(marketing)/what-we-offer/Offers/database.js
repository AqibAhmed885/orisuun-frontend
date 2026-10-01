import Image from 'next/image';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const SearchIcon = staticUrl + "/home/images/swiper/databaseNew.svg";
const Blurs = staticUrl + "/what we offer/platformBlur.svg";

const dataSearch = [
  {
    id: 1,
    parag: 'profiles by member type',
  },
  {
    id: 2,
    parag: 'co-founder, board member, and business development opportunities',
  },
  {
    id: 3,
    parag: 'active fundraising campaigns.',
  },
];

export const Database = () => {
  return (
    <div className="w-full flex lg:flex-row md:flex-col sm:flex-col small-500:flex-col md:gap-10 lg:justify-between small-500:mb-[0px]">
      <div className="relative lg:order-1 md:order-2 small-500:order-2 flex items-center">
        <div className="relative z-10 md:w-full small-500:h-full">
          <Image alt="platform" src={SearchIcon} width={733} height={500}/>
        </div>
        <div className="absolute z-0 w-[607.8px] lg:h-[373px] xl:top-[-20px] xl:left-[60px] lg:top-[-100px] lg:left-[0px] top-[-40px] left-[60px] small-500:top-[-20px] small-500:left-[0px] blur-xl md:w-full small-500:w-[300px] small-500:h-[350px]">
          <Image src={Blurs} alt="blurimage" width={733} height={500}/>
        </div>
      </div>
      <div className="lg:order-2 md:order-1 small-500:order-1 flex gap-8 flex-col lg:justify-between small-500:mb-10 small-500:gap-6">
        <div className="w-full flex flex-col items-start gap-6 lg:w-[480px] small-500:pt-0">
          <h2 className="md:text-[32px] font-semibold text-blue-strong leading-110 text-[20px]">
            Sophisticated Database
          </h2>
          <p className="md:text-[20px] text-blu-ray-300 font-medium leading-150 text-[16px]">
            Find exactly what you need or want around the globe – search by
            industry, country, region, city, and other parameters.
          </p>
          <p className="md:text-[20px] text-blu-ray-300 font-medium leading-150 text-[16px]">
            Our powerful Search and Explore tools enable members to zero in on
            exact matches, using tags, keywords, robust filter options, and
            location.
          </p>
        </div>
        <div className="w-full flex flex-col gap-6 ">
          <h2 className="md:text-[20px] font-semibold text-blue-strong leading-110 text-[16px]">
            Members can search:
          </h2>
          {dataSearch.map((search) => (
            <div key={search.id} className="w-full ">
              <p
                className={`md:text-[20px] font-medium text-blu-ray-300 leading-150 text-[16px]`}
              >{`${search.id}. ${search.parag}`}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
