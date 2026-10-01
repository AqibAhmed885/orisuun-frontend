// ProfileSidebarShimmer.tsx
const ProfileSidebarShimmer = () => (
  <div className="w-full p-4 bg-white rounded-lg border border-gray-200 animate-pulse">
    <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-4 w-full bg-gray-100 rounded" />
      ))}
    </div>
    <div className="h-4 w-24 bg-gray-200 rounded mt-6" />
    <div className="h-4 w-32 bg-gray-100 rounded mt-2" />
    <div className="h-4 w-20 bg-gray-200 rounded mt-2" />
  </div>
);

export default ProfileSidebarShimmer;