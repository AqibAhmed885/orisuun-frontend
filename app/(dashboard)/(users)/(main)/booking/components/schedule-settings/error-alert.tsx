import React from 'react';

interface ErrorAlertProps {
	error: string;
	onDismiss: () => void;
}

export default function ErrorAlert({ error, onDismiss }: ErrorAlertProps) {
	return (
		<div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
			{error}
			<button onClick={onDismiss} className="ml-2 text-xs underline" type="button">
				Dismiss
			</button>
		</div>
	);
}
