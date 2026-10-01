// TabSectionShimmer.tsx
const TabSectionShimmer = () => (
  <div className="w-full p-6 bg-white rounded-xl border border-gray-200 animate-pulse">
    <div className="flex gap-4 mb-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-8 w-24 bg-gray-100 rounded" />
      ))}
    </div>
    <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
    <div className="h-4 w-full bg-gray-100 rounded mb-2" />
    <div className="h-4 w-3/4 bg-gray-100 rounded mb-2" />
    <div className="h-4 w-1/2 bg-gray-100 rounded mb-2" />
  </div>
);

export default TabSectionShimmer;