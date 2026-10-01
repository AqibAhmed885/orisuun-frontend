import React from 'react';

type Community = {
  Id?: string;
  name?: string;
  Description?: string;
  imageUrl?: string;
  MembersCount?: number;
};

const FeaturedCommunity: React.FC<{ community?: Community | null }> = ({ community }) => {
  const fallback = {
    name: 'Strategy Consultant Communities',
    Description: 'A place for strategy consultants to exchange frameworks, case studies, and collaboration opportunities.',
    imageUrl: 'https://placehold.co/600x340.png?text=Featured+Community',
    MembersCount: 1354836,
  };

  const c = community || fallback;

  return (
    <div className="p-6 w-full">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-64 sm:h-80 md:h-96 w-full">
          <img
            src={c.imageUrl}
            alt={c.name}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900">{c.name}</h2>
          <p className="mt-2 text-sm text-gray-600">{c.Description}</p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{c.MembersCount?.toLocaleString() ?? 0} members</span>
            </div>

            <div>
              <button className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-full font-semibold">Join</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCommunity;
