const LoadingSkeleton = ({ contentHeight, cardHeight, imageLeft }) => {
  return (
    <div
      className={`flex justify-between w-full gap-10 flex-col ${
        imageLeft ? 'lg:flex-row-reverse' : 'lg:flex-row'
      } lg:gap-0 lg:pt-[71px] lg:pb-[70px] md:gap-20 animate-pulse`}
    >
      <div
        className={`h-full ${contentHeight} flex flex-col gap-10 md:mt-[59px] lg:w-[594px] small-500:order-1`}
      >
        {/* Title skeleton */}
        <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
        
        {/* Content skeleton */}
        <div className={`w-full h-full flex flex-col gap-6 ${cardHeight}`}>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>
      
      {/* Image skeleton */}
      <div className="h-full small-500:order-2 flex-shrink-0 lg:w-[500px] xl:w-[600px]">
        <div className="w-full h-[300px] lg:h-[400px] bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
