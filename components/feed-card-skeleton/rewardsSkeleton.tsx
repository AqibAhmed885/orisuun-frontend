export function RewardsSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4 lg:h-[450px]] w-full animate-pulse">
      {/* Title and Price */}
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded-md w-1/3"></div> {/* Title */}
        <div className="h-6 bg-gray-200 rounded-md w-16"></div> {/* Price */}
      </div>

      {/* Description */}
      <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>

      {/* Contributors */}
      <div className="h-5 bg-gray-200 rounded-md w-1/4"></div>

      {/* Estimated Delivery */}
      <div className="flex items-center gap-4">
        <div className="h-5 w-5 bg-gray-200 rounded-md"></div>{' '}
        {/* Calendar Icon */}
        <div className="h-4 bg-gray-200 rounded-md w-1/3"></div> {/* Date */}
      </div>

      {/* Right Column - Ships to and Limited Quantity */}
      <div className="flex justify-between">
        {/* Ships to */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded-md w-20"></div> {/* Label */}
          <div className="h-4 bg-gray-200 rounded-md w-32"></div>{' '}
          {/* Content */}
        </div>

        {/* Limited Quantity */}
        <div className="space-y-2 text-right">
          <div className="h-5 bg-gray-200 rounded-md w-24"></div> {/* Label */}
          <div className="h-4 bg-gray-200 rounded-md w-16"></div>{' '}
          {/* Content */}
        </div>
      </div>
    </div>
  );
}

export function RewardsSkeletonList() {
  return (
    <div className="space-y-6 w-full h-full flex flex-col items-center xl:pt-[120px]">
      <div className="max-w-[541px] w-full space-y-[60px]">
      <h1 className="text-h2 text-center lg:!text-left lg:text-5xl font-semibold text-gray-900">
          Rewards Summary
        </h1>
        {Array.from({ length: 1 }).map((_, index) => (
          <RewardsSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
