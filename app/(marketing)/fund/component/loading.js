import { Circle } from "./circle";

export const loading = () => (
  <div className="h-[20px] w-[90px] flex items-center gap-1">
    <Circle className="w-[12px] h-[12px] text-[#3b476233]" />
    <Circle className="w-[12px] h-[12px] text-[#3B476166]" />
    <Circle className="w-[12px] h-[12px] text-[#3B476199]" />
    <Circle className="w-[12px] h-[12px] text-[#3B4761CC]" />
    {
      <div className="flex items-center">
        <Circle className="mx-[2px] w-[12px] h-[12px] text-[#3B4761]" />
      </div>
    }
  </div>
);

export const loading1 = () => (
  <div className="h-[12px] w-[76px] flex gap-1">
    <Circle className="w-[12px] h-[12px] text-[#3b476233]" />
    <Circle className="w-[12px] h-[12px] text-[#3B476166]" />
    <Circle className="w-[12px] h-[12px] text-[#3B476199]" />
    <Circle className="w-[12px] h-[12px] text-[#3B4761CC]" />
    <Circle className="w-[12px] h-[12px] text-[#3B4761]" />
  </div>
);

export const loading2 = () => (
  <div className="h-[12px] w-[60px] flex gap-1">
    <Circle className="w-[12px] h-[12px] text-[#3b476233]" />
    <Circle className="w-[12px] h-[12px] text-[#3B476166]" />
    <Circle className="w-[12px] h-[12px] text-[#3B476199]" />
    <Circle className="w-[12px] h-[12px] text-[#3B4761CC]" />
  </div>
);

export const loading3 = () => (
  <div className="h-[12px] w-[28px] flex gap-1">
    <Circle className="w-[12px] h-[12px] text-[#3b476233]" />
    <Circle className="w-[12px] h-[12px] text-[#3B476166]" />
  </div>
);

export const loading4 = () => (
  <div className="h-[12px] w-[12px] flex">
    <Circle className="w-[12px] h-[12px] text-[#3b476233]" />
  </div>
);
