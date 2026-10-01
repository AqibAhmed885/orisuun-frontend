interface SidePanelButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

export default function SidePanelButton({ active, onClick, label }: SidePanelButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border-2 px-3 py-2 text-left text-sm font-semibold ${
        active
          ? 'border-[#4f6977] bg-white text-[#243845]'
          : 'border-transparent bg-[#e7eaec] text-[#506674] hover:border-[#4f6977]'
      }`}
    >
      {label}
    </button>
  );
}
