import Image from 'next/image';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export default function TrustGrowthSection() {
    return (
        <section className='w-full bg-[#F5F6F9] py-14 md:py-24 relative overflow-hidden'>
            <div className='max-w-[1440px] mx-auto px-4 sm:px-6 relative z-10 flex flex-col xl:flex-row items-center gap-10 md:gap-16'>
                <div className='xl:w-1/3 flex flex-col gap-4 md:gap-6 text-center md:text-left'>
                    <h2 className='text-[34px] leading-[1.1] md:text-6xl md:font-semibold font-medium mb-2 md:mb-4'>
                        More than a network. Built to help you grow
                    </h2>
                    <p className='text-[#5B657B] text-base sm:text-lg md:text-lg leading-relaxed max-w-2xl font-medium mb-4 md:mb-8'>
                        Membership gives small businesses more than exposure. It gives you tools, visibility, connections, and a weekly funding opportunity built into the platform.
                    </p>
                </div>

                <div className='relative xl:w-2/3 w-full'>
                    <div
                        className='absolute top-0 right-0 w-[220px] h-[220px] md:w-[400px] md:h-[400px] rounded-full'
                        style={{
                            background: 'radial-gradient(50% 50% at 50% 50%, rgba(35, 87, 198, 0.2) 0%, rgba(35, 87, 198, 0) 100%)',
                        }}
                    />
                    <div
                        className='absolute bottom-0 left-0 w-[180px] h-[180px] md:w-[300px] md:h-[300px] rounded-full'
                        style={{
                            background: 'radial-gradient(50% 50% at 50% 50%, rgba(235, 197, 42, 0.2) 0%, rgba(235, 197, 42, 0) 100%)',
                        }}
                    />
                    <Image
                        src={`${staticUrl}/landing/weekly-giveaway/laptop.svg`}
                        alt='Orisuun Platform on Laptop'
                        width={1200}
                        height={760}
                        className='w-full h-auto object-contain max-w-3xl mx-auto drop-shadow-2xl relative z-10 hidden md:block'
                    />
                    <Image
                        src={`${staticUrl}/landing/weekly-giveaway/mobile1.svg`}
                        alt='Orisuun Platform on Laptop'
                        width={1200}
                        height={1200}
                        className='w-full h-auto object-cover max-w-3xl mx-auto drop-shadow-2xl relative z-10 block md:hidden'
                    />
                </div>
            </div>
        </section>
    );
}