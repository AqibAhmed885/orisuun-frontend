const button = [
  {
    id: 1,
    text: 'Can be verified',
  },
  {
    id: 2,
    text: 'Access to Team Forming',
  },
  {
    id: 3,
    text: 'Have option to charge for services',
  },
];

export const FeaturesButton = ({ buttons }) => {
  const buttonList = buttons || button;
  return (
    <div className="flex gap-2 overflow-x-auto w-full">
      {buttonList.map((item) => (
        <div
          key={item.id}
          className={`py-[2px] px-3 w-full flex justify-center items-center ${
            item.id === 1
              ? `border border-[#B8DACA] bg-[#F2FCF8] `
              : item.id === 2
              ? `border border-[#D5E8FA] bg-[#F2F7FC]`
              : `border border-[#FAE9D5] bg-[#FFF7E2]`
          } rounded-full`}
        >
          <p
            className={`xl:text-[16px] font-medium leading-150 whitespace-nowrap ${
              item.id === 1
                ? `text-[#177B4C]`
                : item.id === 2
                ? `text-[#2357C6]`
                : `text-[#A57206]`
            } text-[14px]`}
          >
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
};
