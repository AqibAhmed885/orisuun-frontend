import Image from 'next/image';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export default function TrackProgressSection() {
  return (
      <section className='relative overflow-hidden bg-[#F5F6F9] py-14 md:py-[90px]'>
     

      <div className='relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center gap-10 px-4 md:px-6 xl:flex-row xl:gap-14'>
        <div className='w-full max-w-[560px] text-center xl:text-left'>
          <h2 className='text-[34px] font-semibold leading-[1.1] text-[#0F1116] md:text-[72px]'>
            Track your progress
          </h2>
          <p className='mt-4 text-base tracking-wide leading-[1.6] text-[#5B657B] md:mt-6 md:text-2xl max-w-96'>
            See your weekly activity and entry count in real-time
          </p>
        </div>

        <div className='relative w-full max-w-[620px]'>
          <Image
            src={`${staticUrl}/landing/weekly-funding/track-progress-visual.svg`}
            alt='Dashboard showing weekly activity and entry progress'
            width={572}
            height={601}
            className='mx-auto h-auto w-full max-w-[520px] md:max-w-[572px]'
          />
        </div>
      </div>
    </section>
  );
}