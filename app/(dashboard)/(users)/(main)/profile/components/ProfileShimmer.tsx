// MentorProfileShimmer.tsx
const ProfileShimmer = () => (
  <div className="w-full bg-white border-1 rounded-2xl shadow-[#1018280F] shadow-sm relative animate-pulse">
    {/* Banner */}
    <div className="w-full bg-gray-100 border-2 border-[#F9FAFB] rounded-t-2xl h-64" />
    {/* Profile image */}
    <div className="flex flex-col items-center mt-[18vh] md:mt-[20vh] p-6">
      <div className="w-[126px] h-[142px] lg:w-[186px] lg:h-[213px] rounded-full bg-gray-200 mb-4" />
      <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-32 bg-gray-100 rounded mb-2" />
      <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
      <div className="flex gap-2 mt-2">
        <div className="h-8 w-24 bg-gray-100 rounded" />
        <div className="h-8 w-24 bg-gray-100 rounded" />
      </div>
    </div>
  </div>
);

export default ProfileShimmer;