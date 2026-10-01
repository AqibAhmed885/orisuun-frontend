export function FeedCardSkeleton({len = 8}) {
    return (
      <div className="bg-white rounded-xl p-6 space-y-4 shadow-blur animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className=" xs:h-3 xs:w-24 xl:!h-6 bg-gray-200 rounded-md xl:!w-48"></div>
            <div className="flex items-center gap-1">
              <div className="xs:h-3 xs:w-16 xl:!h-4 bg-gray-200 rounded xl:!w-20"></div>
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
  
        <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
  
        <div className="flex flex-wrap gap-2 items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-5 bg-gray-200 rounded-md w-32"></div>
                <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 bg-blue-100 rounded-md xs:min-w-32 xl:!min-w-24"></div>
            <div className="h-9 w-9 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    )
  }
  
  export function FeedSkeletonList({ len = 8 }) {
    return (
      <div className="flex flex-col gap-6 w-full">
        {Array.from({ length: len }).map((_, index) => (
          <FeedCardSkeleton key={index} len={len} />
        ))}
      </div>
    )
  }
  
  