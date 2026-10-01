import Image from 'next/image';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export default function GotoExpert() {
    return (
        <section className="bg-white py-16 sm:py-20">
            <div className="mx-auto grid w-full max-w-[1440px] min-h-[480px] items-center gap-10 px-4 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12">
                <div className="relative min-h-[460px] overflow-hidden  ">

                    <Image
                        src={`${staticUrl}/booking/expert.svg`}
                        alt="Consultant booking board preview"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-left-top pt-8"
                    />
                </div>

                <div className="max-w-[700px]">
                    <h2 className="text-2xl font-normal leading-[1.05] tracking-[-0.02em] text-[#020817] sm:text-5xl">
                        Become the Go-To
                        <br />
                        Expert for the
                        <br />
                        Black Business Ecosystem
                    </h2>
                    <p className="mt-6 text-xl leading-[1.35] text-[#4d5f80] sm:text-[22px">
                        Your profile will sit alongside former founders, executives, and industry pioneers who are dedicated to the Black business ecosystem.
                    </p>
                </div>
            </div>
        </section>
    );
}
