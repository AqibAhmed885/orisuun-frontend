import ToolsComponent from '../ToolsComp';

export const Tools = () => {
  return (
    <div className="w-full lg:px-[81px] mb-[100px] md:px-10 small-500:px-4 small-500:mb-[120px]">
      <div className="w-full flex justify-center">
        <h2 className="md:text-[40px] font-semibold text-blue-strong leading-110 text-center text-[20px]">
          Tools to Build
        </h2>
      </div>
      <div className="w-full h-full ">
        <ToolsComponent />
      </div>
    </div>
  );
};
