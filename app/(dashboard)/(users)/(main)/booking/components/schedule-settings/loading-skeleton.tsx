import React from 'react';

export default function LoadingSkeleton() {
	return (
		<div className=" w-full">
			<div className="space-y-4">
				<div className="rounded-2xl shadow-border shadow-blur p-6 animate-pulse">
					<div className="h-4 w-64 rounded bg-gray-200" />
					<div className="mt-2 h-3 w-36 rounded bg-gray-100" />
					<div className="mt-4 flex gap-3">
						<div className="h-9 w-48 rounded-lg bg-gray-200" />
						<div className="h-9 w-44 rounded-lg bg-gray-200" />
						<div className="h-9 w-52 rounded-lg bg-gray-200" />
					</div>
				</div>
				<div className="rounded-2xl shadow-border p-6 animate-pulse">
					<div className="h-4 w-24 rounded bg-gray-200" />
					<div className="mt-4 grid grid-cols-4 gap-4">
						{[1, 2, 3, 4].map((item) => (
							<div key={item}>
								<div className="h-3 w-12 rounded bg-gray-100 mb-2" />
								<div className="h-12 rounded-lg bg-gray-200" />
							</div>
						))}
					</div>
				</div>
				<div className="rounded-2xl shadow-border p-6 animate-pulse space-y-4">
					<div className="h-4 w-40 rounded bg-gray-200" />
					<div className="grid grid-cols-2 gap-4">
						<div className="h-12 rounded-lg bg-gray-200" />
						<div className="h-12 rounded-lg bg-gray-200" />
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="h-12 rounded-lg bg-gray-200" />
						<div className="h-12 rounded-lg bg-gray-200" />
					</div>
				</div>
			</div>
		</div>
	);
}
