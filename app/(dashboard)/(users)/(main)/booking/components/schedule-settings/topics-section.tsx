import React from 'react';
import { Plus, X } from 'lucide-react';
import type { NewTopicForm, Topic } from './types';

interface TopicsSectionProps {
	topics: Topic[];
	topicMeetingTypeId?: string;
	newTopicForm: NewTopicForm | null;
	onSetNewTopicForm: (form: NewTopicForm | null) => void;
	onAddTopic: (meetingTypeId: string, topicName: string, price: number, durationMinutes: number) => void;
	onDeleteTopic: (id: string) => void;
	onToggleTopic: (topicName: string) => void;
}

export default function TopicsSection({
	topics,
	topicMeetingTypeId,
	newTopicForm,
	onSetNewTopicForm,
	onAddTopic,
	onDeleteTopic,
	onToggleTopic,
}: TopicsSectionProps) {
	return (
		<div className="rounded-2xl shadow-border p-6">
			<h3 className="text-base font-semibold text-[#101828]">Select specific topics</h3>
			<p className="mt-2 text-sm text-[#667085]">Mentor category offerings automatically loaded based on your role.</p>
			<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
				{topics
					.filter((topic) => topicMeetingTypeId && topic.meetingTypeId === topicMeetingTypeId)
					.map((topic) => {
						const active = topic.isActive;

						return (
							<button
								key={topic.id}
								onClick={() => onToggleTopic(topic.topicName)}
								type="button"
								className={`flex text-left gap-3 rounded-lg border px-4 py-3 text-sm font-medium ${
									active ? 'bg-white text-[#0F172A] ring-1 ring-omblue-100' : 'bg-white text-[#334155] shadow-sm'
								}`}
							>
								<div
									className={`h-5 w-5 flex-shrink-0 flex items-center justify-center rounded-md ${
										active ? 'bg-omblue-500 text-white' : 'border border-[#E6EEF8] bg-white'
									}`}
								>
									{active ? '✓' : ''}
								</div>
								<span className="text-sm">{topic.topicName}</span>
								<button
									onClick={(event) => {
										event.stopPropagation();
										onDeleteTopic(topic.id);
									}}
									className="ml-auto text-[#98A2B3] hover:text-red-500"
									type="button"
								>
									<X className="h-4 w-4" />
								</button>
							</button>
						);
					})}
			</div>

			{topicMeetingTypeId && (
				<div className="mt-4">
					{newTopicForm?.meetingTypeId === topicMeetingTypeId ? (
						<div className="flex flex-wrap items-center gap-3">
							<input
								placeholder="Topic name"
								value={newTopicForm.topicName}
								onChange={(event) => onSetNewTopicForm({ ...newTopicForm, topicName: event.target.value })}
								className="rounded-lg border px-3 py-2 text-sm"
							/>
							<input
								placeholder="Price"
								value={newTopicForm.price}
								onChange={(event) => onSetNewTopicForm({ ...newTopicForm, price: event.target.value })}
								className="rounded-lg border px-3 py-2 text-sm w-24"
								type="number"
							/>
							<input
								placeholder="Min"
								value={newTopicForm.durationMinutes}
								onChange={(event) => onSetNewTopicForm({ ...newTopicForm, durationMinutes: event.target.value })}
								className="rounded-lg border px-3 py-2 text-sm w-20"
								type="number"
							/>
							<button
								onClick={() => {
									if (newTopicForm.topicName && newTopicForm.price) {
										onAddTopic(
											topicMeetingTypeId,
											newTopicForm.topicName,
											Number(newTopicForm.price),
											Number(newTopicForm.durationMinutes) || 30
										);
										onSetNewTopicForm(null);
									}
								}}
								className="rounded-md bg-omblue-500 px-3 py-2 text-sm text-white"
								type="button"
							>
								Add
							</button>
							<button
								onClick={() => onSetNewTopicForm(null)}
								className="rounded-md border px-3 py-2 text-sm text-[#334155]"
								type="button"
							>
								Cancel
							</button>
						</div>
					) : (
						<button
							onClick={() => onSetNewTopicForm({ meetingTypeId: topicMeetingTypeId, topicName: '', price: '', durationMinutes: '30' })}
							className="flex items-center gap-2 rounded-lg border border-dashed border-[#D0D5DD] px-4 py-2 text-sm text-[#667085] hover:bg-slate-50"
							type="button"
						>
							<Plus className="h-4 w-4" /> Add topic
						</button>
					)}
				</div>
			)}
		</div>
	);
}
