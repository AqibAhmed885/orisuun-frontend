const ShimmerCard = () => (
  <div className="animate-pulse bg-white rounded-xl p-4 w-full shadow flex flex-col gap-4">
    {/* Top row: avatar, title, icons */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-gray-200 h-12 w-12 rounded-full" />
        <div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
          <div className="h-3 w-24 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-8 bg-gray-200 rounded-full" />
        <div className="h-8 w-8 bg-gray-200 rounded-full" />
      </div>
    </div>
    {/* Code box */}
    <div className="h-10 bg-gray-100 rounded-lg w-full my-2" />
    {/* Subtitle */}
    <div className="h-3 w-1/2 bg-gray-100 rounded mx-2" />
    {/* Bottom row: button and expiry */}
    <div className="flex items-center justify-between mt-4">
      <div className="h-10 w-32 bg-gray-200 rounded-lg" />
      <div className="h-3 w-24 bg-gray-100 rounded" />
    </div>
  </div>
);

export default ShimmerCard;