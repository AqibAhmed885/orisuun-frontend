import FavouriteCard from "@/components/cards/favourite-card";
import SectionHeader from "./section-header";

interface DiscountSectionProps {
  title: string;
  data: any[];
  onViewAll?: () => void;
  isExpanded?: boolean;
  setters: {
    setIsNewData: (data: any[]) => void;
    setMostPopulatedData: (data: any[]) => void;
    setFavouriteData: (data: any[]) => void;
    setExpireData: (data: any[]) => void;
    setUsedData: (data: any[]) => void;
  };
}

const DiscountSection = ({ title, data, onViewAll, isExpanded, setters }: DiscountSectionProps) => {
  if (data.length === 0) return null;


  return (
    <div className="mb-10">
      <SectionHeader title={title} onViewAll={onViewAll} isExpanded={isExpanded} />
      <div className="grid auto-rows-fr grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data.map((item, index) => (
          <FavouriteCard
            key={item?.Id ?? index}
            data={item}
            {...setters}
          />
        ))}
      </div>
    </div>
  );
};

export default DiscountSection;
