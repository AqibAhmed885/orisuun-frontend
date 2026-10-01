'use client';

const RecognitionAward = [
    'Transformational Leadership Specialist',
    'Strategic Planning Expert',
    'Innovative Problem Solver',
    'Agile Project Management Professional',
    'Lean Six Sigma Green Belt',
    'Project Management Professional',
    'Certified Scrum Master',
    'ITIL Foundation Certification',];

export default function RecognitionAwards({ UsersRecognitionAwards }) {
    if (UsersRecognitionAwards?.length > 0) {
        return (
            <div className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm">
                <div className="flex flex-wrap gap-3">
                    {UsersRecognitionAwards.map((skill, index) => (
                        <span
                            key={index}
                            className="border text-[#344054] px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap"
                        >
                            {skill?.Name}
                        </span>
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <div className="text-gray-500 text-sm">
                No Recognition Awards
            </div>
        );
    }
}

