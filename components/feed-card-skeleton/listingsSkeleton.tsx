export function ListingSkeleton() {
    return (
      <div className="bg-white w-full rounded-lg p-6 space-y-4 shadow-md animate-pulse">
        {/* Image Skeleton */}
        <div className="h-36 bg-gray-200 rounded-md"></div>
  
        {/* Title and Description Skeleton */}
        <div className="space-y-3">
          <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
        </div>
  
        {/* Location Section Skeleton */}
        <div className="flex items-center space-x-2">
          <div className="h-4 bg-gray-200 rounded-md w-24"></div>
          <div className="h-4 bg-gray-200 rounded-full w-5"></div>
        </div>
  
        {/* Progress and Info Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded-md w-full"></div>
        </div>
  
        {/* Expiry, Goal, and Contributors Skeleton */}
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded-md w-20"></div>
          <div className="h-4 bg-gray-200 rounded-md w-20"></div>
          <div className="h-4 bg-gray-200 rounded-md w-20"></div>
        </div>
      </div>
    );
  }
  
  export function ListingSkeletonList() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <ListingSkeleton key={index} />
        ))}
      </div>
    );
  }
  