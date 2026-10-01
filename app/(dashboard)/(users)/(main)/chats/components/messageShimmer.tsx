const MessageShimmer = () => {
  return (
    <div className="flex space-x-3 animate-pulse py-6">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gray-300" />

      <div className="flex-1 space-y-2">
        {/* Name + Time */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 bg-gray-300 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>

        {/* Message line */}
        <div className="h-4 w-3/4 bg-gray-200 rounded" />

        {/* Second line (optional) */}
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default MessageShimmer;
