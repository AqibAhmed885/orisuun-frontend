import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import type { MatchingHeroContent } from '@/data/marketing/cofounderMatchingData';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

const defaultHeroContent: MatchingHeroContent = {
    image: `${staticUrl}/matching/hero.svg`,
    mobileBackgroundImage: `${staticUrl}/founder/images/BG container (2).svg`,
    title: 'Precision Matching for the Modern Boardroom.',
    description:
        'Whether you are a business seeking governance or a leader seeking your next seat, our algorithm bridges the gap. We rank and score matches based on expertise, industry relevance, and shared vision-so you can stop searching and start leading.',
    primaryCta: {
        label: 'Find a Board Member',
        href: '/signup',
    },
    secondaryCta: {
        label: 'Find a Board Seat',
        href: '/signup',
    },
    label: '',
};


export default function BoardMatchingHero({ content = defaultHeroContent }: { content?: MatchingHeroContent }) {
    const hasMobileHero = Boolean(content.mobileImage || content.mobileBackgroundImage);

    return (
        <section className="relative overflow-hidden md:min-h-screen ">
            {hasMobileHero ? (
                <div className="relative z-20  bg-[#BAD9FF] md:hidden">
                        <Image
                            src={content.mobileBackgroundImage}
                            alt="Mobile hero background"
                            width={402}
                            height={810}
                            priority
                            sizes="100vw"
                            className="h-auto w-full object-"
                        />
                    <div
                        className="absolute inset-x-0 top-0 z-10 px-5 pt-24"
                    >
                        {content.label && (
                            <p className="text-[20px] font-medium leading-[150%] tracking-wider text-[#98A2B3]">
                                {content.label}
                            </p>
                        )}
                        
                        

                        <h1
                            className="max-w-[330px] text-[32px] font-medium leading-[100%] tracking-tight text-[#06172f]"
                           
                        >
                            {content.title}
                        </h1>

                        <p
                            className="mt-3 max-w-[330px] text-base font-normal leading-[150%] tracking-normal text-[#516176]"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                            {content.description}
                        </p>

                        <div className="mt-5 flex gap-2">
                            <Link
                                href={content.primaryCta.href}
                                className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-[5px] bg-[#003153] px-3 text-[10px] font-medium text-white transition hover:bg-[#07527f]"
                            >
                                <Search size={16} />
                                {content.primaryCta.label}
                            </Link>

                            <Link
                                href={content.secondaryCta.href}
                                className="inline-flex h-9 flex-1 items-center justify-center rounded-[5px] border border-[#00395d] bg-[#0031532B] px-3 text-[10px] font-medium text-[#00395d] transition hover:bg-[#d7ebff]"
                            >
                                {content.secondaryCta.label}
                            </Link>
                        </div>
                    </div>

                    {!content.mobileBackgroundImage && content.mobileImage ? (
                        <div className="relative z-10 aspect-[402/376] w-full overflow-hidden">
                            <Image
                                src={content.mobileImage}
                                alt="Cofounder matching team"
                                fill
                                priority
                                sizes="100vw"
                                className="object-cover object-top"
                            />
                        </div>
                    ) : null}
                </div>
            ) : null}

            {/*  backgroun image */}
            <div className={`${hasMobileHero ? 'hidden md:block' : 'block'} absolute inset-0 -z-0 h-full w-full`}>
                <Image
                    src={content.image}
                    alt="Background pattern"
                    fill
                    priority
                    className="object-cover object-center opacity-100"
                />
            </div>
            <div className={`${hasMobileHero ? 'hidden md:grid' : 'grid'} min-h-screen md:min-h-[760px] lg:grid-cols-[56%_44%]`}>
                <div className="relative z-30 flex items-start px-5 pb-24 pt-28 sm:px-8 md:items-center md:py-24 lg:px-10 xl:px-12">
                    <div className="max-w-[920px]">
                        {content.label && (
                            <p className="text-[20px] font-medium pl-12 pb-4 leading-[1.5] tracking-wider text-[#98A2B3]">
                                {content.label}
                            </p>
                        )}
                        <h1 className="max-w-[920px] text-[32px] font-normal leading-[0.98] tracking-tight text-[#06172f] md:text-[64px] ">
                            {content.title}
                        </h1>

                        <p className="mt-5 max-w-[600px] text-sm leading-[1.45] tracking-wider text-[#516176] sm:text-base md:mt-8">
                            {content.description}
                        </p>

                        <div className="mt-7 flex flex-col gap-4 sm:flex-row md:mt-10">
                            <Link
                                href={content.primaryCta.href}
                                className="inline-flex h-11 items-center justify-center gap-4 rounded-[5px] bg-[#003153] px-6 text-sm font-medium text-white transition hover:bg-[#07527f]"
                            >
                                <Search size={20} />
                                {content.primaryCta.label}
                            </Link>

                            <Link
                                href={content.secondaryCta.href}
                                className="inline-flex h-11 items-center justify-center rounded-[5px] border border-[#00395d]  px-6  text-sm font-medium text-[#00395d] transition hover:bg-[#d7ebff]"
                            >
                                {content.secondaryCta.label}
                            </Link>
                        </div>
                    </div>
                </div>


                {/* <PixelSteps /> */}
            </div>
        </section>
    );
}
