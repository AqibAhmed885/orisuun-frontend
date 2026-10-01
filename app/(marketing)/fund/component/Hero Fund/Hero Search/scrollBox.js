import { SearchList } from "./searchList";
export const ScrollBox = ({ data }) => {
  return (
    <div className="pr-[10.65px] h-full flex flex-col gap-[15px] overflow-y-auto ">
      {data.length > 0 ? (
        data.map((result) => (
          <SearchList
            key={result.id}
            name={result.FirstName + ' ' + result.LastName}
          />
        ))
      ) : (
        <div className="p-4 text-[14px] w-full h-full text-center text-blu-ray-300">
          No contributor found
        </div>
      )}
    </div>
  );
};
