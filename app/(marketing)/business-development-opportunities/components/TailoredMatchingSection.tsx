import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

const matchingPoints = [
  {
    title: 'Capability Matrix Matching',
    description:
      'The engine maps the technical requirements of the opportunity directly against your core service offerings and verified competencies.',
  },
  {
    title: 'Project Scale & Budget Alignment',
    description:
      'It cross-references your optimal contract size and capability limits to ensure the opportunity matches your operational capacity.',
  },
  {
    title: 'Geographic & Regional Fit',
    description:
      'The system analyzes location-based constraints, scoring higher for deals that match your localized presence or target expansion markets.',
  },
  {
    title: 'Timeline & Availability Scoring',
    description:
      "It evaluates your team's current bandwidth and delivery timelines against the project's start or deadline requirements.",
  },
  {
    title: 'Strategic Intent Focus',
    description:
      'The algorithm prioritizes deals that match your stated long-term business goals, from immediate revenue to multi-year enterprise growth.',
  },
];

export default function TailoredMatchingSection() {
  const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL ?? '';

  return (
    <section className="bg-white px-5 py-16 md:px-8 md:py-24 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="text-2xl font-medium leading-[1.02] tracking-normal text-[#0B1220] md:text-[42px]">
            Tailored,{' '}
            <span className="relative inline-flex items-center justify-center px-2 py-1 md:px-4">
              <svg width="405" height="54" viewBox="0 0 405 54" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-0 top-0 z-0 h-full w-full">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M281.443 1.0364C267.222 0.778483 255.257 0.503713 249.081 0.259816C236.882 -0.221988 207.942 -0.0150154 184.766 0.725937C166.95 1.29344 137.753 2.71206 111.247 4.17161C103.835 4.07035 96.3277 3.94358 88.9294 3.79157C22.8365 2.43377 14.359 2.63679 11.0145 5.65747C7.54983 8.78849 7.53671 9.05492 10.8435 9.15094C11.7507 9.17724 12.6813 9.36674 13.4773 9.65664C12.0014 10.0877 11.1471 10.6027 10.5001 11.2236C10.3559 11.3621 10.2178 11.4951 10.0859 11.6229C4.99109 10.77 4.2559 11.2509 5.07819 14.6901C5.26244 15.4605 5.24661 16.3476 5.06571 17.2557C4.5701 17.5639 4.43101 18.1119 4.53806 18.9681C4.0427 20.1536 3.29697 21.2706 2.38152 22.0974C-1.03245 25.181 -0.9375 25.4441 3.72001 25.8079L3.94016 25.8248C3.52264 26.6044 2.99769 27.3223 2.38885 27.9065C-0.926435 31.0878 -0.823246 31.348 3.84366 31.5764C6.60634 31.7113 9.56021 31.723 10.4077 31.6024C11.1106 31.5021 13.5058 33.0162 16.1253 35.1566C14.1159 35.4294 14.7948 35.8521 17.6543 36.8774C17.9633 36.9881 18.266 37.1065 18.5615 37.2313C19.9502 38.3568 21.421 39.2755 22.9732 39.9872C24.5823 41.5029 24.8707 42.8811 22.838 42.9495C16.9004 43.1493 24.232 46.932 38.0517 50.799C53.0883 55.0064 53.9284 55.0095 127.231 51.1421C142.847 50.3183 158.905 49.364 173.483 48.4128C181.671 48.723 191.579 48.9856 201.711 49.1613C209.404 49.5148 217.206 49.8209 224.462 50.0434C267.248 51.3602 374.163 51.9769 359.919 50.8248C347.8 49.8445 354.108 47.8089 373.274 46.5153C383.154 45.8484 391.608 44.3375 392.059 43.1578C392.511 41.9781 395.511 41.0893 398.725 41.1826C403.076 41.309 404.603 40.319 404.697 37.3089C404.734 36.1609 404.483 35.2519 403.829 34.5016C404.659 33.8628 405 32.8757 405 31.4378C405 28.7162 403.43 27.3829 398.729 26.4141C400.789 26.3573 401.251 26.1465 400.352 25.602C401.004 25.1114 400.914 24.1368 400.403 22.459C400.229 21.8882 400.161 21.2443 400.187 20.569C400.914 20.4271 400.909 20.2051 400.25 19.8411C400.485 18.0684 401.309 16.1875 402.527 14.9007C405.639 11.6129 405.529 11.3561 400.977 11.2808C398.482 11.2397 395.833 11.3096 394.801 11.4379C394.099 10.6903 392.185 9.64139 389.301 8.42363C388.63 7.9112 387.938 7.35425 387.25 6.76896C383.356 3.45591 378.874 1.84718 373.811 1.94548C372.68 1.96746 371.215 1.98241 369.462 1.99087C359.018 -0.377711 346.382 -0.173209 286.16 0.945691C284.591 0.974835 283.018 1.00509 281.443 1.0364ZM34.4909 14.3377C34.2407 14.3818 33.9928 14.4261 33.7474 14.4709C33.1433 14.3485 32.5428 14.2204 31.9484 14.087C32.8008 14.1642 33.6499 14.2479 34.4909 14.3377ZM18.5999 8.75224C19.95 8.60239 21.5275 8.46815 23.3801 8.34694C19.9673 8.15886 18.4998 8.2445 18.5999 8.75224Z" fill="#BAD9FF" />
              </svg>

              <span className="relative z-10">Intelligent Matching</span>
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-[580px] text-sm tracking-wider text-[#65728A] leading-loose md:text-base">
            Don&apos;t waste hours chasing deals that aren&apos;t a fit. Our platform evaluates your
            business profile, service offerings, and past success parameters against open
            opportunities.
          </p>
        </div>

        <div className="mt-12 overflow-hidden bg-[#FBFCFE]  md:mt-16 lg:grid lg:min-h-[540px] lg:grid-cols-[1fr_1fr]">
            <div className="h-full w-full relative ">
              <Image
                src={`${staticUrl}/businessDevelopment/matching.svg`}
                alt="Business development opportunities and matching dashboard"
                fill
                sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-contain object-left-top rounded-t-[28px]"
              />
            </div>

          <div className="flex flex-col justify-center px-6 py-10 md:px-10 lg:px-12 lg:py-14">
            <h3 className="max-w-[560px] text-[28px] font-medium leading-[1.08] tracking-wide text-[#07142D] md:text-[32px]">
              The engine scores each deal for relevancy.
            </h3>
            <p className="mt-4 max-w-[610px] text-base tracking-wide leading-[1.42] text-[#65728A] md:text-lg">
              Our proprietary matching algorithm handles the heavy lifting, calculating alignment
              across multiple operational data points so you can focus entirely on high-yield
              opportunities.
            </p>

            <ul className="mt-7 space-y-5">
              {matchingPoints.map((point) => (
                <li key={point.title} className="flex items-start gap-3">
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-[3px] flex-shrink-0">
                    <path d="M8.33333 0C3.73333 0 0 3.73333 0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0ZM6.075 11.9083L3.08333 8.91667C3.00618 8.83951 2.94498 8.74792 2.90323 8.64712C2.86147 8.54632 2.83998 8.43828 2.83998 8.32917C2.83998 8.22006 2.86147 8.11202 2.90323 8.01121C2.94498 7.91041 3.00618 7.81882 3.08333 7.74167C3.16048 7.66451 3.25208 7.60332 3.35288 7.56156C3.45368 7.51981 3.56172 7.49832 3.67083 7.49832C3.77994 7.49832 3.88798 7.51981 3.98879 7.56156C4.08959 7.60332 4.18118 7.66451 4.25833 7.74167L6.66667 10.1417L12.4 4.40833C12.5558 4.25252 12.7671 4.16498 12.9875 4.16498C13.2079 4.16498 13.4192 4.25252 13.575 4.40833C13.7308 4.56415 13.8183 4.77548 13.8183 4.99583C13.8183 5.21619 13.7308 5.42752 13.575 5.58333L7.25 11.9083C7.1729 11.9856 7.08133 12.0469 6.98052 12.0887C6.87971 12.1305 6.77164 12.152 6.6625 12.152C6.55336 12.152 6.44529 12.1305 6.34448 12.0887C6.24367 12.0469 6.15209 11.9856 6.075 11.9083Z" fill="#447DFC" />
                    <path d="M8.33333 0C3.73333 0 0 3.73333 0 8.33333C0 12.9333 3.73333 16.6667 8.33333 16.6667C12.9333 16.6667 16.6667 12.9333 16.6667 8.33333C16.6667 3.73333 12.9333 0 8.33333 0ZM6.075 11.9083L3.08333 8.91667C3.00618 8.83951 2.94498 8.74792 2.90323 8.64712C2.86147 8.54632 2.83998 8.43828 2.83998 8.32917C2.83998 8.22006 2.86147 8.11202 2.90323 8.01121C2.94498 7.91041 3.00618 7.81882 3.08333 7.74167C3.16048 7.66451 3.25208 7.60332 3.35288 7.56156C3.45368 7.51981 3.56172 7.49832 3.67083 7.49832C3.77994 7.49832 3.88798 7.51981 3.98879 7.56156C4.08959 7.60332 4.18118 7.66451 4.25833 7.74167L6.66667 10.1417L12.4 4.40833C12.5558 4.25252 12.7671 4.16498 12.9875 4.16498C13.2079 4.16498 13.4192 4.25252 13.575 4.40833C13.7308 4.56415 13.8183 4.77548 13.8183 4.99583C13.8183 5.21619 13.7308 5.42752 13.575 5.58333L7.25 11.9083C7.1729 11.9856 7.08133 12.0469 6.98052 12.0887C6.87971 12.1305 6.77164 12.152 6.6625 12.152C6.55336 12.152 6.44529 12.1305 6.34448 12.0887C6.24367 12.0469 6.15209 11.9856 6.075 11.9083Z" fill="#337DD4" />
                  </svg>

                  <p className="text-[14px] text-[#5B657B] md:text-base">
                    <strong className="font-semibold ">{point.title}:</strong>{' '}
                    {point.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
