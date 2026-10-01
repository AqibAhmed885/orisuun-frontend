

type ConsultantBookingSprintsProps = {
  title?: string;
  description?: string;
  topics?: string[];
  rows?: number;
};

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

function splitIntoRows(items: string[], rowCount: number) {
  const rows = Array.from({ length: rowCount }, () => [] as string[]);

  items.forEach((item, index) => {
    rows[index % rowCount].push(item);
  });

  return rows;
}

export default function ConsultantBookingSprints({
  title,
  description,
  topics = [],
  rows = 2,
}: ConsultantBookingSprintsProps) {
  const sprintRows = splitIntoRows(topics, rows);

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 md:min-h-[620px] px-4">
      {/* Background image - right side */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 z-0 md:h-[600px] md:w-[600px] h-[300px] w-[300px] -translate-y-1/2 bg-contain bg-center bg-no-repeat "
        style={{ backgroundImage: `url('${staticUrl}/booking/bg-spirit.svg')` }}
      />

      <div className="relative z-10 mx-auto w-full  ">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="text-2xl font-normal leading-[1.06] tracking-[-0.02em] text-[#0F1116] sm:text-[45px]">
            {title || "Define Your 'Sprints.'"}
          
          </h2>

          <p className="mt-4 text-lg leading-[1.45] text-[#5B657B] sm:text-xl">
            {description || 'You choose what you offer and the time you want to dedicate to each session. You can choose which of these \'Sprints\' to list on your profile.'}
          </p>
        </div>

        <div className="relative mt-12 space-y-5 overflow-hidden">
          {sprintRows.map((row, rowIndex) => {
            const isReverse = rowIndex % 2 !== 0;

            return (
              <div key={rowIndex} className="relative flex overflow-hidden">
                <div
                  className={`flex w-max shrink-0 gap-4 sm:gap-5 ${isReverse ? 'animate-sprints-reverse' : 'animate-sprints'
                    }`}
                >
                  {[...row, ...row, ...row].map((topic, index) => (
                    <span
                      key={`${topic}-${index}`}
                      className="inline-flex md:min-h-[58px] min-h-[30px] shrink-0 items-center rounded-full border border-[#2357C680] bg-[#F9F9FB33] md:px-8 px-4 md:text-lg text-xs font-normal leading-none text-[#13171F]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div
                  className={`flex w-max shrink-0 gap-4 sm:gap-5 ${isReverse ? 'animate-sprints-reverse' : 'animate-sprints'
                    }`}
                  aria-hidden="true"
                >
                  {[...row, ...row, ...row].map((topic, index) => (
                    <span
                      key={`${topic}-duplicate-${index}`}
                      className="inline-flex md:min-h-[58px] min-h-[30px] shrink-0 items-center rounded-full border border-[#2357C680] bg-[#F9F9FB33] md:px-8 px-4 md:text-lg text-xs font-normal leading-none text-[#13171F]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
