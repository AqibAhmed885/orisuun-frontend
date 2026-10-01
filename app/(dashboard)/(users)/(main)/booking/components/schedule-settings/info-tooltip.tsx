import React from 'react';

interface InfoTooltipProps {
	text: string;
	example?: string;
}

export default function InfoTooltip({ text, example }: InfoTooltipProps) {
	return (
		<div className="group relative inline-flex items-center justify-center">
			<span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#344054] text-[11px] font-semibold text-[#344054]">
				i
			</span>
			<span className="pointer-events-none absolute bottom-full left-2 z-20 mb-3 w-[360px] max-w-[264px] -translate-x-0 rounded-xl bg-[#101828] p-2 text-left text-white opacity-0 shadow-2xl transition-opacity duration-150 group-hover:opacity-100">
				<span className="block text-xs leading-[1.4]">{text}</span>
				<h1 className="mt-2 block text-xs font-semibold leading-[1.4] text-white">Example:</h1>
				{example && <span className="mt-2 block text-xs leading-[1.4] text-white">{example}</span>}
			</span>
		</div>
	);
}
