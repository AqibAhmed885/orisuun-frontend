export const Loader: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-20">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};
