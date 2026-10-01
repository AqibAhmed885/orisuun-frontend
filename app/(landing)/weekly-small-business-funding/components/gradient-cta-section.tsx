import Link from 'next/link';

type GradientCtaSectionProps = {
  title: string | React.ReactNode;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  text?: string;
  sectionClassName?: string;
  cardClassName?: string;
  cardBackground?: string;
    buttonBackground?: string;
  textWidthClass?: string;
};

export default function GradientCtaSection({
  title,
  description,
  buttonLabel,
  buttonHref,
  text,
  sectionClassName = 'w-full py-24',
    cardClassName = 'rounded-[40px] md:min-h-[430px] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-2xl relative text-white overflow-hidden',
  cardBackground = 'linear-gradient(360deg, #2558C7 -22.22%, #0F1116 63.1%)',
    buttonBackground = 'linear-gradient(90deg, #2357C6 0%, #5F8EF2 50%, #2357C6 100%)',
  textWidthClass = 'max-w-lg',
}: GradientCtaSectionProps) {
  return (
    <section className={sectionClassName}>
      <div className='max-w-[1200px] mx-auto px-6'>
        <div className={cardClassName} style={{ background: cardBackground }}>
          <div className={`w-full flex flex-col justify-center ${textWidthClass} text-center mx-auto items-center z-10`}>
            <h2 className='text-3xl md:text-5xl  font-semibold mb-6'>{title}</h2>
            <p className=' text-lg md:text-lg leading-relaxed mb-8'>{description}</p>
            <Link
              href={buttonHref}
              className='text-white flex px-8 py-4 rounded-xl font-medium text-base tracking-wide transition-colors shadow-lg items-center gap-3 hover:brightness-95'
              style={{ background: buttonBackground }}
            >
              {buttonLabel}
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M4.17188 10H15.8385' stroke='#FBFBFD' strokeWidth='1.66667' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M10 4.16602L15.8333 9.99935L10 15.8327' stroke='#FBFBFD' strokeWidth='1.66667' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            </Link>
            {
              text && <p className='md:text-base text-[11px] mt-2 tracking-wide text-white mt-4'>{text}</p>
            }
          </div>

        </div>
      </div>
    </section>
  );
}
