const steps = [
    {
        title: 'Join',
        desc: 'Join as a business member',
        icon: (
            <svg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M18.6615 24.5V22.1667C18.6615 20.929 18.1698 19.742 17.2946 18.8668C16.4195 17.9917 15.2325 17.5 13.9948 17.5H6.99479C5.75711 17.5 4.57013 17.9917 3.69496 18.8668C2.81979 19.742 2.32812 20.929 2.32812 22.1667V24.5' stroke='white' strokeWidth='2.33333' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M10.4948 12.8333C13.0721 12.8333 15.1615 10.744 15.1615 8.16667C15.1615 5.58934 13.0721 3.5 10.4948 3.5C7.91746 3.5 5.82812 5.58934 5.82812 8.16667C5.82812 10.744 7.91746 12.8333 10.4948 12.8333Z' stroke='white' strokeWidth='2.33333' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M22.1719 9.3335V16.3335' stroke='white' strokeWidth='2.33333' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M25.6719 12.8335H18.6719' stroke='white' strokeWidth='2.33333' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        title: 'Complete Profile',
        desc: 'Complete your business profile',
        icon: (
            <svg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M17.5052 2.3335H7.00521C6.38637 2.3335 5.79288 2.57933 5.35529 3.01691C4.91771 3.4545 4.67188 4.04799 4.67188 4.66683V23.3335C4.67188 23.9523 4.91771 24.5458 5.35529 24.9834C5.79288 25.421 6.38637 25.6668 7.00521 25.6668H21.0052C21.624 25.6668 22.2175 25.421 22.6551 24.9834C23.0927 24.5458 23.3385 23.9523 23.3385 23.3335V8.16683L17.5052 2.3335Z' stroke='white' strokeWidth='2.33333' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M16.3281 2.3335V7.00016C16.3281 7.619 16.574 8.21249 17.0115 8.65008C17.4491 9.08766 18.0426 9.3335 18.6615 9.3335H23.3281' stroke='white' strokeWidth='2.33333' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M10.5 17.5003L12.8333 19.8337L17.5 15.167' stroke='white' strokeWidth='2.33333' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        title: 'Stay Active',
        desc: 'Stay active on the platform',
        icon: (
            <svg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M25.6615 14.0002H22.7681C22.2583 13.9991 21.7621 14.165 21.3554 14.4726C20.9488 14.7802 20.6541 15.2126 20.5165 15.7035L17.7748 25.4568C17.7571 25.5174 17.7203 25.5706 17.6698 25.6085C17.6193 25.6464 17.5579 25.6668 17.4948 25.6668C17.4317 25.6668 17.3703 25.6464 17.3198 25.6085C17.2693 25.5706 17.2325 25.5174 17.2148 25.4568L10.7748 2.5435C10.7571 2.48291 10.7203 2.42969 10.6698 2.39183C10.6193 2.35396 10.5579 2.3335 10.4948 2.3335C10.4317 2.3335 10.3703 2.35396 10.3198 2.39183C10.2693 2.42969 10.2325 2.48291 10.2148 2.5435L7.47313 12.2968C7.336 12.7858 7.04307 13.2168 6.6388 13.5242C6.23453 13.8316 5.741 13.9987 5.23312 14.0002H2.32812' stroke='white' strokeWidth='2.33333' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        title: 'Selection (each Monday)',
        desc: 'A weekly winner is selected from the eligible entry pool',
        icon: (
            <svg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M6.99479 10.4998H5.24479C4.47124 10.4998 3.72938 10.1925 3.1824 9.64557C2.63542 9.09858 2.32812 8.35672 2.32812 7.58317C2.32812 6.80962 2.63542 6.06776 3.1824 5.52078C3.72938 4.97379 4.47124 4.6665 5.24479 4.6665H6.99479' stroke='white' strokeWidth='2.33333' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M21 10.5003H22.75C23.5235 10.5003 24.2654 10.193 24.8124 9.64605C25.3594 9.09907 25.6667 8.35721 25.6667 7.58366C25.6667 6.81011 25.3594 6.06825 24.8124 5.52126C24.2654 4.97428 23.5235 4.66699 22.75 4.66699H21' stroke='white' strokeWidth='2.33333' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M4.67188 25.6665H23.3385' stroke='white' strokeWidth='2.33333' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M11.6719 17.1035V19.8335C11.6719 20.4752 11.1235 20.9768 10.5402 21.2452C9.16354 21.8752 8.17188 23.6135 8.17188 25.6668' stroke='white' strokeWidth='2.33333' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M16.3281 17.1035V19.8335C16.3281 20.4752 16.8765 20.9768 17.4598 21.2452C18.8365 21.8752 19.8281 23.6135 19.8281 25.6668' stroke='white' strokeWidth='2.33333' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M21 2.33301H7V10.4997C7 12.3562 7.7375 14.1367 9.05025 15.4494C10.363 16.7622 12.1435 17.4997 14 17.4997C15.8565 17.4997 17.637 16.7622 18.9497 15.4494C20.2625 14.1367 21 12.3562 21 10.4997V2.33301Z' stroke='white' strokeWidth='2.33333' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
];

export default function HowItWorksSection() {
    return (
        <section className='w-full py-20 bg-gray-50 mb-[-40px]'>
            <div className='max-w-[1440px] mx-auto px-6 space-y-16'>
                <div className='flex flex-col items-center'>
                    <h2 className='text-3xl md:text-4xl text-[#001E5F] font-bold text-center mt-3 mb-4'>How it works</h2>
                    <p className='text-[#5B657B] text-lg md:text-xl leading-relaxed max-w-4xl font-medium text-center'>
                        Getting started is simple. Active participation earns you entries automatically.
                    </p>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-14 sm:gap-y-0 relative'>
                    <svg
                        className='sm:hidden absolute left-0 top-8 z-0 w-[59px] h-[calc(100%-4rem)] pointer-events-none'
                        viewBox='0 0 59 334'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        aria-hidden='true'
                        preserveAspectRatio='none'
                    >
                        <path
                            opacity='0.3'
                            d='M33.7734 333.213L26.1286 325.684C-4.48266 295.536 -0.848066 245.154 33.7734 219.713L38.3112 214.624C65.5741 184.049 63.563 137.332 33.7734 109.213L25.5067 103.166C-10.7961 76.6135 -6.31696 21.1017 33.7734 0.712891'
                            stroke='#2357C6'
                            strokeWidth='1.6'
                            strokeDasharray='8 8'
                        />
                    </svg>

                    <svg
                        className='hidden lg:block absolute -top-4 left-1/2 -translate-x-1/2 z-0 w-full max-w-[calc(100%-20rem)] h-auto pointer-events-none'
                        viewBox='0 0 983 79'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        aria-hidden='true'
                    >
                        <path
                            opacity='0.3'
                            d='M0.203125 60.4026C0.628829 60.4026 2.49435 59.5015 5.5596 57.8504C112.538 0.225693 239.779 -5.0134 345.703 54.5284L363.016 59.2076C458.734 85.0765 559.912 82.5229 654.203 51.8584C750.459 -14.5292 877.508 -15.3545 974.619 49.777L981.703 54.5284'
                            stroke='#2357C6'
                            strokeWidth='3'
                            strokeDasharray='8 8'
                        />
                    </svg>

                    {steps.map((step, i) => (
                        <div key={i} className='flex md:flex-col items-center md:text-center md:gap-2 gap-4 relative z-10'>
                            <div className='w-16 h-16 flex-shrink-0 rounded-full bg-[#2357C6] text-white flex items-center justify-center text-2xl font-bold shadow-xl'>
                                {step.icon}
                            </div>
                            <div className="flex flex-col justify-center">
                                <h3 className='text-2xl font-semibold text-[#001E5F] mt-4'>{step.title}</h3>
                                <p className='text-[#5B657B] text-base max-w-[252px] leading-relaxed md:px-4'>{step.desc}</p>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
