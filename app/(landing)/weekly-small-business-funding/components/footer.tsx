import Image from 'next/image';
import Link from 'next/link';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

type FooterLinkGroup = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

const footerGroups: FooterLinkGroup[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/what-we-offer' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'How It Works', href: '#how-it-works' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/insights' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Selection Rules', href: '/weekly-small-business-funding/rules' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className='w-full bg-[#0A193A] px-6 py-8 md:px-12 lg:px-[120px]'>
      <div className='mx-auto w-full max-w-[1440px]'>
        <div className='flex flex-col gap-10 border-b border-white/10 py-10 lg:flex-row lg:items-start lg:justify-between'>
          <div className='max-w-[284px]'>
            <Link href='/' aria-label='Orisuun home'>
              <Image src={`${staticUrl}/landing/weekly-giveaway/footer-logo.svg`} alt='Orisuun' width={158} height={46} />
            </Link>
            <p className='mt-3 text-base text-[#D4D9E6]'>The global network for small businesses.</p>
          </div>

          <div className='grid w-full gap-10 grid-cols-2 lg:max-w-[760px] md:grid-cols-3'>
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className='text-base font-semibold text-white'>{group.title}</h3>
                <ul className='mt-4 space-y-3'>
                  {group.links.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className='text-base text-[#D4D9E6] transition-colors hover:text-white'>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className='flex flex-col-reverse gap-4 py-6 items-center text-sm text-[#8E9AB8] sm:flex-row sm:items-center sm:justify-between'>
          <p>© 2026 Orisuun. All rights reserved</p>
          <div className='flex gap-4 flex-wrap items-center justify-start sm:justify-end'>
            <Link href='http://linkedin.com/company/orisuun' target='_blank' rel='noopener noreferrer' className='text-[#C6C6C6] transition-colors hover:text-white'>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_190_3741)">
                  <g clip-path="url(#clip1_190_3741)">
                    <path d="M11.6465 9.6612V9.63013C11.6393 9.64088 11.631 9.65164 11.625 9.6612H11.6465Z" fill="#C6C6C6" />
                    <path d="M1 0.331055V20.3311H21V0.331055H1ZM7.22111 16.9466H4.25333V8.01883H7.22111V16.9466ZM5.73667 6.80105H5.71778C4.72222 6.80105 4.07667 6.1155 4.07667 5.25772C4.07667 4.38217 4.74111 3.7155 5.75667 3.7155C6.77222 3.7155 7.39667 4.38217 7.41556 5.25772C7.41556 6.1155 6.77222 6.80105 5.73667 6.80105ZM17.9233 16.9466H14.9544V12.1699C14.9544 10.9711 14.5267 10.1522 13.4522 10.1522C12.6311 10.1522 12.1444 10.7033 11.9289 11.2377C11.8511 11.4277 11.8311 11.6933 11.8311 11.9611V16.9466H8.86222C8.86222 16.9466 8.90222 8.85661 8.86222 8.01883H11.8311V9.28439C12.2256 8.67772 12.9289 7.80994 14.5056 7.80994C16.4589 7.80994 17.9233 9.0855 17.9233 11.8277V16.9466Z" fill="#C6C6C6" />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_190_3741">
                    <rect width="21.5119" height="21.5119" fill="white" />
                  </clipPath>
                  <clipPath id="clip1_190_3741">
                    <rect width="21.5119" height="21.5119" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Link>

            <Link href='https://www.tiktok.com/@orisuun' target='_blank' rel='noopener noreferrer' className='text-[#C6C6C6] transition-colors hover:text-white' >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.3113 13.928C24.4923 13.928 24.6733 13.918 24.8533 13.901H24.8563V10.24C23.4813 10.14 22.1853 9.559 21.1943 8.601C20.2053 7.644 19.5833 6.369 19.4393 5H16.2823L16.2493 20.36C16.2493 22.244 14.5833 23.728 12.6953 23.728C11.7893 23.728 10.9203 23.369 10.2793 22.729C9.30032 21.754 9.00732 20.284 9.53632 19.008C10.0663 17.731 11.3133 16.901 12.6953 16.905C12.8003 16.905 12.9023 16.919 13.0033 16.933L13.1093 16.947V13.653C12.9713 13.64 12.8333 13.633 12.6953 13.632C9.99032 13.633 7.55032 15.26 6.51032 17.758C5.47332 20.256 6.04632 23.132 7.96032 25.042C9.87632 26.956 12.7553 27.528 15.2573 26.492C17.7593 25.461 19.3913 23.023 19.3903 20.317V11.272C20.4783 12.931 22.3293 13.929 24.3123 13.927L24.3113 13.928Z" fill="#C6C6C6" />
              </svg>
            </Link>


            <Link href='https://www.instagram.com/orisuun/' target='_blank' rel='noopener noreferrer' className='text-[#C6C6C6] transition-colors hover:text-white'>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.315 0C12.745 0 13.099 0.0129999 14.123 0.0599999C15.187 0.109 15.914 0.278 16.55 0.525C17.2175 0.775874 17.8222 1.16936 18.322 1.678C18.8306 2.17777 19.2241 2.7825 19.475 3.45C19.722 4.086 19.891 4.813 19.94 5.877C19.988 6.944 20 7.284 20 10V10.08C20 12.723 19.988 13.067 19.94 14.123C19.891 15.187 19.722 15.914 19.475 16.55C19.2241 17.2175 18.8306 17.8222 18.322 18.322C17.8222 18.8306 17.2175 19.2241 16.55 19.475C15.914 19.722 15.187 19.891 14.123 19.94C13.056 19.988 12.716 20 10 20H9.92C7.277 20 6.933 19.988 5.877 19.94C4.813 19.891 4.086 19.722 3.45 19.475C2.7825 19.2241 2.17777 18.8306 1.678 18.322C1.16936 17.8222 0.775874 17.2175 0.525 16.55C0.278 15.914 0.109 15.187 0.0599999 14.123C0.0129999 13.099 0 12.744 0 10.315V9.685C0 7.255 0.0129999 6.901 0.0599999 5.877C0.109 4.813 0.278 4.086 0.525 3.45C0.775874 2.7825 1.16936 2.17777 1.678 1.678C2.17777 1.16936 2.7825 0.775874 3.45 0.525C4.086 0.278 4.813 0.109 5.877 0.0599999C6.901 0.0129999 7.256 0 9.685 0H10.315ZM10.234 1.802H9.766C7.31 1.802 6.982 1.813 5.959 1.86C4.984 1.905 4.455 2.067 4.102 2.204C3.635 2.386 3.302 2.602 2.952 2.952C2.602 3.302 2.386 3.635 2.204 4.102C2.067 4.455 1.904 4.984 1.86 5.959C1.813 6.982 1.802 7.31 1.802 9.766V10.234C1.802 12.69 1.813 13.018 1.86 14.041C1.905 15.016 2.067 15.545 2.204 15.898C2.386 16.364 2.603 16.698 2.952 17.048C3.302 17.398 3.635 17.614 4.102 17.796C4.455 17.933 4.984 18.096 5.959 18.14C7.013 18.188 7.329 18.198 10 18.198H10.08C12.677 18.198 12.997 18.188 14.04 18.14C15.016 18.095 15.545 17.933 15.898 17.796C16.364 17.614 16.698 17.398 17.048 17.048C17.398 16.698 17.614 16.365 17.796 15.898C17.933 15.545 18.096 15.016 18.14 14.041C18.188 12.986 18.198 12.671 18.198 10V9.92C18.198 7.323 18.188 7.003 18.14 5.96C18.095 4.984 17.933 4.455 17.796 4.102C17.6358 3.66757 17.3802 3.2746 17.048 2.952C16.7254 2.61986 16.3324 2.36426 15.898 2.204C15.545 2.067 15.016 1.904 14.041 1.86C13.018 1.813 12.69 1.802 10.234 1.802ZM10 4.865C10.6743 4.865 11.3421 4.99782 11.9651 5.25588C12.5881 5.51394 13.1542 5.89218 13.631 6.36901C14.1078 6.84584 14.4861 7.41191 14.7441 8.03492C15.0022 8.65793 15.135 9.32566 15.135 10C15.135 10.6743 15.0022 11.3421 14.7441 11.9651C14.4861 12.5881 14.1078 13.1542 13.631 13.631C13.1542 14.1078 12.5881 14.4861 11.9651 14.7441C11.3421 15.0022 10.6743 15.135 10 15.135C8.63811 15.135 7.33201 14.594 6.36901 13.631C5.40601 12.668 4.865 11.3619 4.865 10C4.865 8.63811 5.40601 7.33201 6.36901 6.36901C7.33201 5.40601 8.63811 4.865 10 4.865ZM10 6.667C9.11603 6.667 8.26827 7.01815 7.64321 7.64321C7.01815 8.26827 6.667 9.11603 6.667 10C6.667 10.884 7.01815 11.7317 7.64321 12.3568C8.26827 12.9818 9.11603 13.333 10 13.333C10.884 13.333 11.7317 12.9818 12.3568 12.3568C12.9818 11.7317 13.333 10.884 13.333 10C13.333 9.11603 12.9818 8.26827 12.3568 7.64321C11.7317 7.01815 10.884 6.667 10 6.667ZM15.338 3.462C15.6563 3.462 15.9615 3.58843 16.1865 3.81347C16.4116 4.03852 16.538 4.34374 16.538 4.662C16.538 4.98026 16.4116 5.28548 16.1865 5.51053C15.9615 5.73557 15.6563 5.862 15.338 5.862C15.0197 5.862 14.7145 5.73557 14.4895 5.51053C14.2644 5.28548 14.138 4.98026 14.138 4.662C14.138 4.34374 14.2644 4.03852 14.4895 3.81347C14.7145 3.58843 15.0197 3.462 15.338 3.462Z" fill="#C6C6C6" />
              </svg>
            </Link>


            <Link href='https://www.youtube.com/@orisuun' target='_blank' rel='noopener noreferrer' className='text-[#C6C6C6] transition-colors hover:text-white'>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_291_3304)">
                  <path d="M12.4881 19.1999L7.97506 19.1169C6.51306 19.0879 5.04806 19.1449 3.61506 18.8469C1.43606 18.4019 1.28206 16.2189 1.12006 14.3869C0.893065 11.8019 0.988065 9.19893 1.40406 6.63792C1.64106 5.20592 2.57406 4.35092 4.01806 4.25792C8.89007 3.91992 13.7951 3.95992 18.6581 4.11792C19.1711 4.13192 19.6881 4.21092 20.1941 4.30092C22.6941 4.73892 22.7541 7.21292 22.9161 9.29592C23.0781 11.3999 23.0101 13.5159 22.7011 15.6059C22.4531 17.3359 21.9791 18.7859 19.9791 18.9259C17.4721 19.1099 15.0231 19.2579 12.5091 19.2109C12.5101 19.1989 12.4961 19.1989 12.4891 19.1989L12.4881 19.1999ZM9.83506 14.8189C11.7241 13.7339 13.5761 12.6669 15.4551 11.5899C13.5621 10.5059 11.7131 9.43993 9.83506 8.36193V14.8189Z" fill="#C6C6C6" />
                </g>
                <defs>
                  <clipPath id="clip0_291_3304">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Link>


          </div>
        </div>
      </div>
    </footer>
  );
}