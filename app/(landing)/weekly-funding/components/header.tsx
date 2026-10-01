import Image from 'next/image';
import Link from 'next/link';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

type HeaderProps = {
	signInLink?: string;
	joinLink?: string;
};

export default function Header({ signInLink = '/signin', joinLink = '/signup' }: HeaderProps) {
	return (
		<header className='fixed top-4 md:top-6 left-0 right-0 z-30 px-4 sm:px-6'>
			<div className='mx-auto w-full max-w-[990px] rounded-2xl border border-white bg-white/10 backdrop-blur-md px-4 py-3'>
				<nav className='flex items-center justify-between gap-4'>
					<Link href='/' aria-label='Orisuun home'>
						<Image
							src={`${staticUrl}/landing/weekly-giveaway/header-logo.svg`}
							alt='Orisuun'
							width={120}
							height={36}
							priority
						/>
					</Link>

					<div className='flex items-center gap-2'>
						<Link
							href={signInLink}
							className='rounded-[10px] bg-white/50 px-3 py-2 text-[15px] font-semibold leading-4 tracking-[-0.02em] text-[#0A193A]'
						>
							Sign In
						</Link>

						<div className='rounded-[10px] bg-gradient-to-b from-[#0A193A] via-[#2357C6] to-[#69B3E7] p-[1px]'>
							<Link
								href={joinLink}
								className='block rounded-[9px] bg-white px-5 py-[11px] text-[15px] font-semibold leading-4 tracking-[-0.02em] text-[#2357C6]'
							>
								Join Now
							</Link>
						</div>
					</div>
				</nav>
			</div>
		</header>
	);
}
