export function AccordianSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 space-y-4 animate-pulse">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-gray-200 rounded-md w-36"></div>
          <div className="flex items-center gap-1">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
          </div>
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}

export function AccordianSkeletonList() {
  return (
    <div className="flex flex-col w-full">
      {Array.from({ length: 3 }).map((_, index) => (
        <AccordianSkeleton key={index} />
      ))}
    </div>
  );
}
