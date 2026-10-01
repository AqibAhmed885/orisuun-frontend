import Image from 'next/image';

interface BenefitCardProps {
  icon: string;
  title: string;
  points: string[];
}

export default function BenefitCard({ icon, title, points }: BenefitCardProps) {
  return (
    <article className="min-h-[280px] border-b border-[#D5DCE8] bg-white px-6 py-7 last:border-b-0 md:min-h-[280px] md:px-8 md:py-8 lg:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(n+4)]:border-b-0">
      <div className="relative h-10 w-10">
        <Image src={icon} alt="" fill className="object-contain" />
      </div>

      <div className="mt-12 md:mt-16">
        <h3 className="text-base font-semibold  text-[#0A2E68]">
          {title}
        </h3>

        <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm font-medium tracking-wide text-[#667085] marker:text-[#667085]">
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
