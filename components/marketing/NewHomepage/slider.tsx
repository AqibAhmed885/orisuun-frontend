'use client';

const activities = [
    { label: 'BLACK-OWNED BUSINESSES DISCOVERED:', value: '1713' },
    { label: 'Mentor sessions booked', value: '245' },
    { label: 'Investor sessions booked', value: '67' },
    { label: 'Connections made', value: '8009' },
    { label: 'Communities Rooms Created', value: '173' },
    { label: 'Strategic consultations booked', value: '42' },
    { label: 'Crowdfunding campaigns launched', value: '104' },
    { label: 'Discounts offered', value: '296' },
    { label: 'Discounts redeemed ', value: '612' },
];

export default function Slider() {
	const items = [...activities, ...activities];

	return (
		<div className="relative w-full overflow-hidden  py-6">
			<div className="flex flex-col md:flex-row items-center md:gap-6 gap-2 whitespace-nowrap px-2">
				<div className="sticky left-0 z-30 flex shrink-0 items-center gap-3 bg-white pr-5 text-base font-medium text-slate-900">
                    <span className="flex h-6 w-6 md:h-10 md:w-10 items-center justify-center md:rounded-lg rounded-sm bg-[#BAD9FF8C] text-[#000511] shadow-sm">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 8.5H4L6.5 3L10.5 13.5L13 8.5H15" stroke="#04171D" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
					<span>Ecosystem Activities:</span>
				</div>

                <div className="relative min-w-0 flex-1 overflow-hidden">
                    <div className="pointer-events-none absolute left-0 top-0 z-50 h-full w-24 bg-gradient-to-r from-white to-transparent" />
                    <div className="pointer-events-none absolute right-0 top-0 z-50 h-full w-24 bg-gradient-to-l from-white to-transparent" />
					<div className="slider-track flex w-max items-center gap-10 py-1">
						{items.map((item, index) => (
							<div
								key={`${item.label}-${index}`}
								className="flex shrink-0 items-center gap-3 text-sm "
							>
                                <span className="text-[#FE713D8F] text-2xl">•</span>
								<span className="text-slate-500 uppercase">{item.label}</span>
								<span className="rounded-sm bg-slate-100 px-3  text-slate-900 shadow-sm">
									{item.value}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>

			<style jsx>{`
				.slider-track {
					animation: slider-move 30s linear infinite;
				}

				@keyframes slider-move {
					from {
						transform: translateX(0);
					}
					to {
						transform: translateX(-40%);
					}
				}
			`}</style>
		</div>
	);
}
