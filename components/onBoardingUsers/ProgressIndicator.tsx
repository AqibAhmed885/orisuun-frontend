'use client';

interface ProgressIndicatorProps {
  current: number;
  total: number;
}

export default function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`h-2  rounded-full transition-colors ${
            index === current ? 'bg-blue-600 w-7' : 'bg-gray-300 w-2'
          }`}
        />
      ))}
    </div>
  );
}