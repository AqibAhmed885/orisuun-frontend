import { Activity, ClipboardCheck, UserRoundPlus } from "lucide-react";

const steps = [
  {
    label: "Step 1",
    title: "Pick Your Challenge.",
    description: '(e.g., "I need a pitch deck audit.")',
    Icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.6615 24.5V22.1667C18.6615 20.929 18.1698 19.742 17.2946 18.8668C16.4195 17.9917 15.2325 17.5 13.9948 17.5H6.99479C5.75711 17.5 4.57013 17.9917 3.69496 18.8668C2.81979 19.742 2.32813 20.929 2.32812 22.1667V24.5" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M10.4948 12.8333C13.0721 12.8333 15.1615 10.744 15.1615 8.16667C15.1615 5.58934 13.0721 3.5 10.4948 3.5C7.91746 3.5 5.82812 5.58934 5.82812 8.16667C5.82812 10.744 7.91746 12.8333 10.4948 12.8333Z" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M22.1719 9.3335V16.3335" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M25.6719 12.8335H18.6719" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
,
  },
  {
    label: "Step 2",
    title: "Choose Your Expert.",
    description: "(Browse by industry, background, or specialty.)",
    Icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.5052 2.3335H7.00521C6.38637 2.3335 5.79288 2.57933 5.35529 3.01691C4.91771 3.4545 4.67188 4.04799 4.67188 4.66683V23.3335C4.67188 23.9523 4.91771 24.5458 5.35529 24.9834C5.79288 25.421 6.38637 25.6668 7.00521 25.6668H21.0052C21.624 25.6668 22.2175 25.421 22.6551 24.9834C23.0927 24.5458 23.3385 23.9523 23.3385 23.3335V8.16683L17.5052 2.3335Z" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M16.3281 2.3335V7.00016C16.3281 7.619 16.574 8.21249 17.0115 8.65008C17.4491 9.08766 18.0426 9.3335 18.6615 9.3335H23.3281" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M10.5 17.5001L12.8333 19.8334L17.5 15.1667" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
,
  },
  {
    label: "Step 3",
    title: "Connect Instantly.",
    description: "(Meet via our secure, built-in video platform. No Zoom links required.)",
    Icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25.6615 14.0002H22.7681C22.2583 13.9991 21.7621 14.165 21.3554 14.4726C20.9488 14.7802 20.6541 15.2126 20.5165 15.7035L17.7748 25.4568C17.7571 25.5174 17.7203 25.5706 17.6698 25.6085C17.6193 25.6464 17.5579 25.6668 17.4948 25.6668C17.4317 25.6668 17.3703 25.6464 17.3198 25.6085C17.2693 25.5706 17.2325 25.5174 17.2148 25.4568L10.7748 2.5435C10.7571 2.48291 10.7203 2.42969 10.6698 2.39183C10.6193 2.35396 10.5579 2.3335 10.4948 2.3335C10.4317 2.3335 10.3703 2.35396 10.3198 2.39183C10.2693 2.42969 10.2325 2.48291 10.2148 2.5435L7.47313 12.2968C7.336 12.7858 7.04307 13.2168 6.6388 13.5242C6.23453 13.8316 5.741 13.9987 5.23312 14.0002H2.32812" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
,
  },
];

export default function QuestionToSolutionSection() {
  return (
    <section className=" mt-2 w-full  bg-[#EEEFF5] rounded-[12px]">
      <div className="relative overflow-hidden rounded-[8px]  px-5 pt-10 pb-16 sm:px-10 md:py-24 lg:px-16">
        <h2 className="mx-auto max-w-5xl text-center text-2xl font-normal leading-[1.08] tracking-normal text-[#111520] sm:text-[36px] lg:text-[42px]">
          From Question to Solution <br className="md:hidden" /> in 3 Clicks
        </h2>

        <div className="relative mx-auto mt-16 max-w-[1220px] lg:mt-20">
          <svg width="871" height="68" viewBox="0 0 871 68" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[calc(100%_-_16rem)] md:block hidden">
            <path opacity="0.3" d="M0.203125 45.1554C0.59256 45.1554 2.29167 44.3496 5.08331 42.8724C103.715 -9.32023 220.401 -14.1307 318.07 39.8425L338.8 45.3502C423.558 67.8696 513.162 64.061 595.703 34.4307L607.62 28.2229C693.937 -16.7432 799.353 -1.34575 869.203 66.4307" stroke="#2357C6" stroke-width="3" stroke-dasharray="8 8" />
          </svg>
          <svg width="38" height="379" viewBox="0 0 38 379" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-2  block md:hidden">
            <path opacity="0.3" d="M24.665 378.158C24.665 377.976 24.1549 377.131 23.2266 375.743C-4.43926 334.375 -6.53755 281.182 21.779 240.257L24.5246 232.004C36.7626 195.216 34.7335 155.173 18.8394 119.811L18.1889 118.814C-6.65248 80.7286 1.114 30.0554 36.2215 1.1582" stroke="#2357C6" stroke-width="3" stroke-dasharray="8 8" />
          </svg>


          <div className="grid  md:grid-cols-3 gap-20">
            {steps.map(({ label, title, description, Icon }) => (
              <div key={label} className="relative z-10 flex md:flex-col gap-4 items-center md:text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#003153] to-[#5EA8FF] flex-shrink-0 text-white shadow-[0_18px_45px_rgba(14,83,147,0.22)]">
                  {Icon}
                </div>
                <div className="md:mt-6 flex flex-col gap-2 md:items-center md:text-center">
                  <h3 className="md:mt-8 text-xl font-semibold leading-none text-[#001E5F]">
                    {label}
                  </h3>
                  <p className="md:mt-8 text-sm font-semibold leading-[1.35] text-[#5B657B]">
                    {title}
                  </p>
                  <p className="mt-1 max-w-[340px] text-sm leading-[1.45] text-[#5B657B]">
                    {description}
                  </p>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
