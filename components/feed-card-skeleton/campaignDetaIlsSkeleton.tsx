export function CampaignSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded-md w-32"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-24"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded-md w-24"></div>
                <div className="h-4 bg-gray-200 rounded-md w-20"></div>
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded-md w-24"></div>
                <div className="h-4 bg-gray-200 rounded-md w-20"></div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-md w-20"></div>
                <div className="h-4 bg-gray-200 rounded-md w-20"></div>
              </div>
              <div className="h-36 bg-gray-200 rounded-md w-full"></div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded-md w-40"></div>
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
            <div className="h-36 bg-gray-200 rounded-md w-full"></div>
          </div>

          <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded-md w-32"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-24"></div>
                </div>
              </div>
              <div className="space-y-2 bg-white">
                <div className="h-6 bg-gray-200 rounded-md w-24"></div>
                <div className="h-4 bg-gray-200 rounded-md w-20"></div>
              </div>
              <div className="space-y-2 bg-white">
                <div className="h-6 bg-gray-200 rounded-md w-24"></div>
                <div className="h-4 bg-gray-200 rounded-md w-20"></div>
              </div>
            </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white rounded-lg shadow-custom p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-md w-32"></div>
                <div className="h-4 bg-gray-200 rounded-md w-24"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          </div>

          <div className="bg-white rounded-lg shadow-custom p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded-md w-40"></div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-md w-12"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-custom p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded-md w-40"></div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-md w-12"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-custom p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded-md w-40"></div>
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
            <div className="h-10 bg-gray-200 rounded-md w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CampaignDetailSkeletonList() {
  return (
    <div className="space-y-6  w-full lg:col-span-2 xl:col-span-3">
      {Array.from({ length: 1 }).map((_, index) => (
        <CampaignSkeleton key={index} />
      ))}
    </div>
  );
}
