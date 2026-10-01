import React, { useEffect, useState } from "react";
import Image from "next/image";
import { leaderboard } from "@/app/api/dashboard/leaderboard";

type CountryCardProps = {
  name: string;
  resources: number;
  showFlag?: boolean;
};

const CountryCard: React.FC<CountryCardProps> = ({ name, resources, showFlag = true }) => {
  const [flagUrl, setFlagUrl] = useState<string | null>(null);

  useEffect(() => {
    if (showFlag) {
      let isMounted = true;
      let idleId: number | null = null;
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      // Use requestIdleCallback for better performance
      const fetchFlag = () => {
        leaderboard.fetchCountryFlag(name).then((url) => {
          if (isMounted) setFlagUrl(url);
        });
      };

      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(fetchFlag);
      } else {
        timeoutId = setTimeout(fetchFlag, 0);
      }

      return () => {
        isMounted = false;
        if (idleId !== null) window.cancelIdleCallback(idleId);
        if (timeoutId !== null) clearTimeout(timeoutId);
      };
    }
  }, [name, showFlag]);

  return (
    <div className="bg-white   flex flex-col justify-between">
      <hr className="pb-2 mx-2"/>
      <div className="border-r border-l space-y-5 p-6 flex flex-col justify-between h-full">
          {showFlag ? (
            flagUrl ? (
            <div className="relative group">
              <Image
                src={flagUrl}
                alt={name}
                width={120}
                height={120}
                className="rounded-full w-12 h-12 object-cover"
                loading="lazy"
                priority={false}
              />
              {/* Tooltip */}
              <div className="absolute left-0 top-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {name}
              </div>
            </div>
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
            )
        ) : null}
        <h3 className="font-semibold text-4xl mb-2">{name}</h3>
        <div className="flex justify-between">
          <div className="text-xs text-gray-400 mb-2">{resources} resources</div>
          <span className="text-[#357CF6] text-sm font-medium">
            See details 
          </span>
        </div>
      </div>
     
    </div>
  );
};

export default CountryCard;
