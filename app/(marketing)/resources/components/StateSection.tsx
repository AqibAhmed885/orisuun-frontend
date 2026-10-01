import React, { useEffect, useState } from "react";
import CountryCard from "./CountryCard";
import SearchIcon from "@/icons/search-icon";
import { getStatesWithResourceCounts } from "@/app/api/marketing/resources";

const StateSkeleton = () => (
  <div className="bg-white py-2 flex flex-col justify-between">
    <hr className="pb-2 mx-2" />
    <div className="border-r space-y-5 p-6 flex flex-col justify-between h-full">
      <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
      </div>
    </div>
  </div>
);

type StateSectionProps = {
  countryId: number;
  onStateSelect: (stateId: number, stateName: string) => void;
};

const StateSection: React.FC<StateSectionProps> = ({ countryId, onStateSelect }) => {
  const [statesList, setStatesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    getStatesWithResourceCounts(countryId)
      .then((states) => {
        const filtered = states.filter(s => s.resourceCount > 0);
        setStatesList(filtered);
      })
      .catch(() => setStatesList([]))
      .finally(() => setLoading(false));
  }, [countryId]);

  const filteredStates = statesList.filter((state) => {
    const lowerQuery = query.toLowerCase();
    return state.name.toLowerCase().includes(lowerQuery);
  });

  return (
    <div>
      {/* Search */}
      <div className="relative md:w-1/2 w-full mt-4">
        <input
          type="search"
          placeholder="Search States..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border rounded-full pl-10 pr-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dbeafe]"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          <SearchIcon />
        </div>
      </div>

      {/* State Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-16 pt-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <StateSkeleton key={idx} />
          ))}
        </div>
      ) : filteredStates.length === 0 ? (
        <div className="py-16 text-center text-gray-400 text-lg">
          No states available for this country.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-16 pt-6">
          {filteredStates.map((state, idx) => (
            <div
              key={state.id}
              onClick={() => onStateSelect(state.id, state.name)}
              className="cursor-pointer"
            >
              <CountryCard
                name={state.name}
                resources={state.resourceCount}
                showFlag={false}
              />
              {idx >= filteredStates.length - 3 && <hr className="pb-2 mx-2" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StateSection;
