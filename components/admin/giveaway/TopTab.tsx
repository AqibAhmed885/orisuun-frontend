interface TopTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function TopTab({ label, active, onClick }: TopTabProps) {
  return (
    <button
      onClick={onClick}
      className={`border-b pb-1 ${active ? 'border-[#4f6977]' : 'border-transparent'}`}
    >
      {label}
    </button>
  );
}
