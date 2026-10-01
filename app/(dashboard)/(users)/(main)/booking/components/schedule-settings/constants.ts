import type { OfficeHours, ProfessionalTopicGroup, TopicOfferingConfig } from './types';

export const FIXED_DURATIONS = [15, 30, 60, 90];
export const FIXED_ADVISORY_PLANS = ['In-depth', 'Sprint'];

export const MEETING_TYPE_CATEGORIES = [
	'One Time Video Consultation',
	'Ongoing Advisory Plan',
	'Topic-Specific Consultations',
];

export const SPECIALTIES = [
	'Term sheet tear down',
	'Valuation reality check',
	'The "anti-pitch" session',
	'Cap table cleanup',
	'Investor persona mapping',
	'Pitch analysis',
	'Pitch deck audit',
];

export const PROFESSIONAL_TOPIC_GROUPS: ProfessionalTopicGroup[] = [
	{
		label: 'Human Resources and People Operations',
		topics: [
			{ topicName: 'First hire compliance check' },
			{ topicName: 'Culture and values workshop' },
			{ topicName: 'Compensation strategy' },
			{ topicName: 'The contractor vs employee audit' },
			{ topicName: 'Benefits 101 for small teams' },
		],
	},
	{
		label: 'Cybersecurity Professionals',
		topics: [
			{ topicName: 'The password and MFA lockdown' },
			{ topicName: 'Software stack cleanup' },
			{ topicName: 'Data privacy practices' },
			{ topicName: 'Hardware lifecycle plan' },
		],
	},
	{
		label: 'Operations and Supply Chain',
		topics: [
			{ topicName: 'The unit cost breakdown' },
			{ topicName: 'Vendor redundancy mapping' },
			{ topicName: 'Manufacturing in China' },
			{ topicName: 'Manufacturing in India' },
			{ topicName: 'Manufacturing in another region' },
			{ topicName: 'Outsourcing strategy' },
			{ topicName: 'Packaging' },
			{ topicName: 'Warehouse slotting optimization' },
			{ topicName: 'Governance compliance and optimization' },
		],
	},
	{
		label: 'Corporate Finance Professionals',
		topics: [
			{ topicName: 'Cash flow stress test' },
			{ topicName: 'Lender-ready review' },
			{ topicName: 'The profitability by product deep dive' },
			{ topicName: 'Exit valuation analysis' },
			{ topicName: 'Debt restructuring strategy' },
		],
	},
	{
		label: 'Marketing and Brand Strategy',
		topics: [
			{ topicName: 'A user friction audit' },
			{ topicName: 'Brand voice alignment' },
			{ topicName: 'Logo and asset modernization' },
			{ topicName: 'Product messaging' },
			{ topicName: 'Marketing channels assessment' },
			{ topicName: 'Social media analysis' },
			{ topicName: 'SEO analysis' },
			{ topicName: 'Get chatbot ready' },
		],
	},
	{
		label: 'Insurance and Risk Management',
		topics: [
			{ topicName: 'Insurance-risk analysis' },
			{ topicName: 'Key person insurance planning' },
			{ topicName: "Worker's compensation audit" },
			{ topicName: 'Disaster recovery walkthrough' },
			{ topicName: 'Product liability risk assessment' },
		],
	},
	{
		label: 'Legal',
		topics: [
			{ topicName: 'Commercial lease "Gotcha" audit' },
			{ topicName: 'Customer contracts audit' },
			{ topicName: 'Trademarks audit' },
			{ topicName: 'Copyright audit' },
			{ topicName: 'Patent audit' },
			{ topicName: 'Data privacy compliance' },
			{ topicName: 'Founder agreements' },
		],
	},
];

export const TOPIC_OFFERINGS: Record<string, TopicOfferingConfig> = {
	investor: {
		key: 'investor',
		label: 'Investors',
		description: 'Investor category offerings automatically loaded based on your role.',
		type: 'flat',
		topics: SPECIALTIES.map((topicName) => ({ topicName })),
	},
	mentor: {
		key: 'mentor',
		label: 'Mentors',
		description: 'Mentor category offerings automatically loaded based on your role.',
		type: 'flat',
		topics: [
			{ topicName: 'First hire framework' },
			{ topicName: 'Founder burnout audit' },
			{ topicName: 'Supplier diversity navigation' },
			{ topicName: 'Succeeding in the vendor game' },
			{ topicName: 'Networking tools' },
			{ topicName: 'Pivoting roadmap' },
			{ topicName: 'Realistic goal setting' },
			{ topicName: 'Franchising your business' },
			{ topicName: 'Buying into a franchise' },
		],
	},
	professional: {
		key: 'professional',
		label: 'Professionals',
		description: 'Professional category offerings automatically loaded based on your role.',
		type: 'grouped',
		groups: PROFESSIONAL_TOPIC_GROUPS,
	},
	'strategic-consultant': {
		key: 'strategic-consultant',
		label: 'Strategic Consultants',
		description: 'Strategic consultant offerings automatically loaded based on your role.',
		type: 'flat',
		topics: [
			{ topicName: 'Blue ocean mapping' },
			{ topicName: 'Competitive intelligence session' },
			{ topicName: 'Moving to value-based pricing' },
			{ topicName: 'Exit strategies and options' },
			{ topicName: 'Mergers and acquisitions' },
			{ topicName: 'Market entry' },
			{ topicName: 'Recurring revenue options exploration' },
			{ topicName: 'Risks analysis' },
		],
	},
	expert: {
		key: 'expert',
		label: 'Experts',
		description: 'Create your own topic-specific consultations.',
		type: 'custom',
		customOnly: true,
	},
};

export function normalizeProfileType(value?: string | null) {
	return String(value || '')
		.toLowerCase()
		.replace(/[_-]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

export function getTopicOfferingKey(value?: string | null) {
	const normalized = normalizeProfileType(value);

	if (!normalized) return 'mentor';
	if (normalized.includes('expert')) return 'expert';
	if (normalized.includes('strategic consultant') || normalized.includes('strategy consultant')) return 'strategic-consultant';
	if (normalized.includes('professional')) return 'professional';
	if (normalized.includes('mentor')) return 'mentor';
	if (normalized.includes('investor')) return 'investor';

	return 'mentor';
}

export function getTopicOffering(value?: string | null): TopicOfferingConfig {
	const key = getTopicOfferingKey(value);
	return TOPIC_OFFERINGS[key] ?? TOPIC_OFFERINGS.mentor;
}

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DAY_OF_WEEK_MAP: Record<string, number> = {
	Sunday: 0,
	Monday: 1,
	Tuesday: 2,
	Wednesday: 3,
	Thursday: 4,
	Friday: 5,
	Saturday: 6,
};

export const CANCELLATION_OPTIONS = ['24 Hours Before Meeting', '48 Hours Before Meeting', '12 Hours Before Meeting'];

export const LATE_FEE_OPTIONS = [
	'5% Fee Charged',
	'10% Fee Charged',
	'15% Fee Charged',
	'20% Fee Charged',
	'25% Fee Charged',
	'30% Fee Charged',
	'35% Fee Charged',
	'40% Fee Charged',
	'45% Fee Charged',
	'50% Fee Charged',
];

export const createEmptyOfficeHours = (): OfficeHours => ({
	Monday: { enabled: false, slots: [] },
	Tuesday: { enabled: false, slots: [] },
	Wednesday: { enabled: false, slots: [] },
	Thursday: { enabled: false, slots: [] },
	Friday: { enabled: false, slots: [] },
	Saturday: { enabled: false, slots: [] },
	Sunday: { enabled: false, slots: [] },
});

export const createDefaultOfficeHours = (): OfficeHours => ({
	...createEmptyOfficeHours(),
	Monday: {
		enabled: true,
		slots: [
			{ start: '09:00', end: '18:30' },
			{ start: '09:00', end: '18:30' },
		],
	},
});
