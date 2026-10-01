'use client';

const skills = [
    'Transformational Leadership Specialist',
    'Strategic Planning Expert',
    'Innovative Problem Solver',
    'Agile Project Management Professional',
    'Lean Six Sigma Green Belt',
    'Project Management Professional',
    'Certified Scrum Master',
    'ITIL Foundation Certification',
];

export default function Skills({ UserSkills }) {
    return (
        <>
            {UserSkills?.length > 0 ? (<div className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm">
                <div className="flex flex-wrap gap-3">
                    {UserSkills?.map((skill, index) => (
                        <span
                            key={index}
                            className="bg-[#EFF8FF] text-[#2357C6] px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap"
                        >
                            {skill?.Skill}
                        </span>
                    ))}
                </div>
            </div>) : (<div className="text-gray-500 text-sm">No Skill</div>)}

        </>
    );
}
