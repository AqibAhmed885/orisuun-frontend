'use client';

const publications = [
    `Explore the insights from "Navigating Leadership in a Tech-Driven Era" (2021) – a vital resource for investors looking to understand the complexities of leadership in today's digital landscape.`,
    `Investigated corporate governance trends in the Journal of Business Ethics, emphasizing the importance of ethical decision-making for investors in boardroom dynamics.`,
    `Recognized in the 2022 edition of "Innovative Leaders in Business" for groundbreaking work in strategic leadership that appeals to investor interests.`,
    `Analyzed process enhancement techniques in manufacturing, featured in the International Journal of Quality Management, providing valuable insights for investors in operational efficiency.`,
];

export default function Publications({ UserPublicationResearch }) {
    return (
        <div className="">
            {UserPublicationResearch?.length > 0 ? (<ul className="space-y-4">
                {UserPublicationResearch?.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <span className="mt-1 w-5 h-[6px] rounded-full bg-[#BFD2FB] flex-shrink-0"></span>
                        <p className="text-sm text-slate-700">{item?.Title}</p>
                    </li>
                ))}
            </ul>) : (<div className="text-gray-500 text-sm">No Publications & Research </div>)}

        </div>
    );
}
