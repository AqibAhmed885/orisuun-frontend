'use client'
import HowItWorksSticky from "./HowItWorksSticky"

export const HowItWorks = () => {
    const steps = [
        {
            id: 'search',
            stepId: 1,
            isLeft: false,
            title: (
                <>
                    Search and <span className="text-omblue-500">Explore</span>
                </>
            ),
            description:
                'Search directly for Black-owned businesses in your neighborhood and around the world by product, service, industry or location.',
            images: [
                {
                    src: `${process.env.NEXT_PUBLIC_STATIC_URL}/find/how/crown2.png`,
                    description:
                        'Search directly for Black-owned businesses in your neighborhood and around the world by product, service, industry or location.',
                    bgImage: `${process.env.NEXT_PUBLIC_STATIC_URL}/find/how/how-bg-1.svg`,
                },
                {
                    src: `${process.env.NEXT_PUBLIC_STATIC_URL}/find/how/how-search.svg`,
                    description:
                        'Or browse and drill down to the businesses that interest you the most',
                },
            ],
        },

        {
            id: 'connect',
            stepId: 2,
            isLeft: false,
            title: (
                <>
                    Compare{' '}
                    <span className="inline-flex p-1 -mb-1 items-center">
                        <svg
                            width="38"
                            height="38"
                            viewBox="0 0 38 38"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M19.0197 37.2928C29.244 37.2928 37.5325 29.0043 37.5325 18.78C37.5325 8.55564 29.244 0.267166 19.0197 0.267166C8.79531 0.267166 0.506836 8.55564 0.506836 18.78C0.506836 29.0043 8.79531 37.2928 19.0197 37.2928Z"
                                fill="#2357C6"
                            />
                            <path
                                d="M17 10H12C10.9 10 10 10.9 10 12V26C10 27.1 10.9 28 12 28H17V30H19V8H17V10ZM17 25H12L17 19V25ZM26 10H21V12H26V25L21 19V28H26C27.1 28 28 27.1 28 26V12C28 10.9 27.1 10 26 10Z"
                                fill="white"
                            />
                        </svg>
                    </span>
                    all of the Black-owned{' '}
                    <span className="text-omblue-500">options</span>
                    {' '}  within your search criteria 
                </>
            ),
            description:
                'Easily connect with Black-owned businesses through calls, emails, website visits, and social media to learn more about their offerings.',
            images: [
                {
                    src: `${process.env.NEXT_PUBLIC_STATIC_URL}/find/how/star2.svg`,
                    description:
                        'Map view: Get directions to your new discovery, and see how businesses relate to you',
                },
                {
                    src: `${process.env.NEXT_PUBLIC_STATIC_URL}/find/how/how-2-3.svg`,
                    description:
                        'List view: quickly compare and filter options',
                },
                {
                    src: `${process.env.NEXT_PUBLIC_STATIC_URL}/find/how/how-2-2.svg`,
                    description:
                        "Card view: see breakdown of each business's product and reviews",
                },
            ],
        },

        {
            id: 'support',
            stepId: 3,
            isLeft: true,
            title: (
                <>
                    Visit and <span className="text-omblue-500">Review</span>
                </>
            ),
            description:
                'Support Black-owned businesses by making purchases, leaving reviews, and sharing your experiences.',
            images: [
                {
                    src: `${process.env.NEXT_PUBLIC_STATIC_URL}/find/how/check3.png`,
                    description: 'Let the world know what your experience was like',
                    bgImage: `${process.env.NEXT_PUBLIC_STATIC_URL}/find/how/how-bg-4.svg`,
                },
            ],
        },

        {
            id: 'repeat',
            stepId: 4,
            isLeft: true,
            title: (
                <>
                    Take it <span className="text-omblue-500">Anywhere</span>
                </>
            ),
            description:
                'Make it a habit to seek out and support Black-owned businesses regularly.',
            images: [
                {
                    src: `${process.env.NEXT_PUBLIC_STATIC_URL}/find/how/mobile.svg`,
                    description:
                        'Find Black-owned businesses in your neighborhood and around the world',
                    // bgImage: '/find/how/how-bg-5.svg',
                },
            ],
        },
    ];

    return (
        <section className="relative flex flex-col px-6 z-10 items-center justify-center" aria-label="How Orisuun works">
            <div className="max-w-7xl w-full relative mx-auto pb-20 min-h-screen px-6 mt-10 bg-[#ECF0FA] rounded-xl py-10">
                <h2 className="relative flex items-center justify-center">
                    <span className="text-5xl md:text-8xl font-medium text-[#001E5F]">How It Works</span>

                    <svg width="180" height="40" viewBox="0 0 166 30" fill="none" className="absolute -bottom-6 md:w-full w-[90px] md:-ml-[20rem] -ml-40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <mask id="mask0_4834_218285" maskUnits="userSpaceOnUse" x="0" y="5" width="166" height="20">
                            <path d="M166 5.25604H0V24.7439H166V5.25604Z" fill="white" />
                        </mask>
                        <g mask="url(#mask0_4834_218285)">
                            <path d="M5.40771 17.5218C40.6728 9.33881 112.38 6.93399 160.53 17.5218" stroke="#2357C6" stroke-width="9.74389" stroke-linecap="round" />
                        </g>
                    </svg>

                </h2>
                <div className="md:mt-16 mt-6">
                    <HowItWorksSticky steps={steps} />
                </div>

                {/* <div className="absolute -bottom-[6px] h-24 overflow-hidden z-10 left-8">
                   <LottieAnimation
                        src="/find/lottie/full-bounce-arrow.json"
                                           width={300}
                                           height={300}
                                        //    loop={true}
                                        //    speed={1}
                                       />
                </div> */}
            </div>
            <svg width="115" height="73" viewBox="0 0 115 73" fill="none" xmlns="http://www.w3.org/2000/svg" className="-mt-3 w-18 h-14" aria-hidden="true">
                <path d="M63.1603 69.6549C59.9716 73.317 54.2823 73.317 51.0936 69.6549L1.98314 13.2534C-2.52438 8.07667 1.15237 -3.05176e-05 8.01651 -3.05176e-05L106.237 -3.05176e-05C113.101 -3.05176e-05 116.778 8.07668 112.271 13.2534L63.1603 69.6549Z" fill="#ECF0FA" />
            </svg>


        </section>

    )
}