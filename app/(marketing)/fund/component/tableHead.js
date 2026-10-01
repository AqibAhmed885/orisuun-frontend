const top = [
  'Idea',
  'Family & Friends',
  'Seed /Angel',
  'Series A - D (Venture Capital)',
  'Exit / Acquisition',
];

export const TableHead = ({ className }) => (
  <div className="w-full flex gap-[20px] small-500:gap-2">
    <div
      className={`h-full xl:w-[180px] small-500:w-[120px] ${className}`}
    ></div>
    <div className="w-full grid grid-cols-5 gap-[20px] small-500:gap-2">
      {top.map((title, index) => (
        <div
          key={index}
          className={`h-[70px] w-[200px] flex justify-center items-center small-500:w-[140px] small-500:h-[50px]`}
        >
          <p
            className={`my-[25.6px] mx-[14.63px] text-center text-[#3B4761] text-[16px] font-semibold leading-150 ${
              index === 3 ? `h-[40px] flex items-center` : 'h-[24px]'
            } small-500:text-[14px]`}
          >
            {title}
          </p>
        </div>
      ))}
    </div>
  </div>
);
