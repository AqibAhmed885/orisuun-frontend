import { ConfirmState } from './types';

interface ConfirmDialogProps {
  state: ConfirmState;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ state, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!state.open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/40 p-4">
      <div className="w-full max-w-[520px] rounded-xl bg-[#f3f3f3] p-6 md:p-8">
        <p className="text-center text-lg font-semibold text-[#243845]">{state.title}</p>
        <p className="mt-3 text-center text-sm text-[#2d414f]">{state.message}</p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#243845]"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="rounded-lg border-2 border-[#4f6977] bg-white px-4 py-2 text-sm font-semibold text-[#243845]"
            onClick={onConfirm}
          >
            {state.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
