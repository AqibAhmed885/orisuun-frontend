import React from 'react';

interface ActionsRowProps {
	saving: boolean;
	onCancel: () => void;
	onSave: () => void;
}

export default function ActionsRow({ saving, onCancel, onSave }: ActionsRowProps) {
	return (
		<div className="mt-6 flex items-center justify-between">
			<button onClick={onCancel} className="rounded-md border px-4 py-2 text-sm font-medium text-[#334155] bg-white" type="button">
				Cancel
			</button>
			<button
				onClick={onSave}
				disabled={saving}
				className="rounded-md bg-omblue-500 px-4 py-2 text-sm font-semibold text-white disabled:bg-omblue-200 disabled:cursor-not-allowed"
				type="button"
			>
				{saving ? 'Saving…' : 'Save'}
			</button>
		</div>
	);
}
