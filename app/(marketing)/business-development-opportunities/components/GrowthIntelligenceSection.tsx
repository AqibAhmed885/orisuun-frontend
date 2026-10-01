import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
} from 'lucide-react';



export default function GrowthIntelligenceSection({
  description,
  growthIntelligenceTitle,
  growthIntelligenceButtonLabel,
  growthIntelligenceDescription,
  growthCards
}) {
  return (
    <section className="bg-white px-5 pb-20 pt-10 md:px-8 md:pb-28 md:pt-16 lg:px-10">
      <div className="mx-auto max-w-[1260px]">
        <div className="mx-auto max-w-[920px] text-center">
          <h2 className="text-2xl  text-[#0B1220] md:text-[42px]">
            <span className="relative inline-flex items-center justify-center px-2 py-1 ">
              <svg width="381" height="49" viewBox="0 0 381 49" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-0 top-0 z-0 size-[105%]">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M264.765 -3.9636C251.386 -4.22152 240.131 -4.49629 234.321 -4.74018C222.845 -5.22199 195.619 -5.01502 173.817 -4.27406C157.057 -3.70656 129.59 -2.28794 104.655 -0.828387C97.682 -0.92965 90.6194 -1.05642 83.6595 -1.20843C21.4833 -2.56623 13.5081 -2.36321 10.3618 0.65747C7.10243 3.78849 7.09009 4.05492 10.2009 4.15094C11.0544 4.17724 11.9299 4.36674 12.6786 4.65664C11.2902 5.08775 10.4866 5.60271 9.87787 6.22357C9.74218 6.36206 9.61231 6.49513 9.48824 6.62294C4.69532 5.76998 4.0037 6.25086 4.77726 9.69005C4.95059 10.4605 4.9357 11.3476 4.76552 12.2557C4.29928 12.5639 4.16843 13.1119 4.26914 13.9681C3.80314 15.1536 3.10159 16.2706 2.24039 17.0974C-0.971271 20.181 -0.881944 20.4441 3.49957 20.8079L3.70667 20.8248C3.31389 21.6044 2.82005 22.3223 2.24729 22.9065C-0.871535 26.0878 -0.774461 26.348 3.61589 26.5764C6.21485 26.7113 8.99368 26.723 9.79096 26.6024C10.4522 26.5021 12.7055 28.0162 15.1697 30.1566C13.2794 30.4294 13.9181 30.8521 16.6082 31.8774C16.8988 31.9881 17.1836 32.1065 17.4616 32.2313C18.768 33.3568 20.1516 34.2755 21.6118 34.9872C23.1255 36.5029 23.3969 37.8811 21.4846 37.9495C15.8989 38.1493 22.7961 41.932 35.7968 45.799C49.9423 50.0064 50.7326 50.0095 119.691 46.1421C134.382 45.3183 149.488 44.364 163.202 43.4128C170.906 43.723 180.227 43.9856 189.757 44.1613C196.995 44.5148 204.335 44.8209 211.16 45.0434C251.411 46.3602 351.991 46.9769 338.59 45.8248C327.189 44.8445 333.123 42.8089 351.154 41.5153C360.449 40.8484 368.401 39.3375 368.826 38.1578C369.251 36.9781 372.073 36.0893 375.097 36.1826C379.19 36.309 380.626 35.319 380.715 32.3089C380.749 31.1609 380.513 30.2519 379.899 29.5016C380.68 28.8628 381 27.8757 381 26.4378C381 23.7162 379.523 22.3829 375.101 21.4141C377.038 21.3573 377.473 21.1465 376.628 20.602C377.241 20.1114 377.157 19.1368 376.676 17.459C376.512 16.8882 376.448 16.2443 376.473 15.569C377.156 15.4271 377.151 15.2051 376.532 14.8411C376.752 13.0684 377.528 11.1875 378.674 9.90073C381.601 6.61288 381.497 6.35614 377.215 6.28081C374.869 6.23968 372.376 6.30958 371.406 6.43789C370.745 5.69033 368.944 4.64139 366.231 3.42363C365.6 2.9112 364.949 2.35425 364.302 1.76896C360.639 -1.54409 356.422 -3.15282 351.659 -3.05452C350.595 -3.03254 349.217 -3.01759 347.568 -3.00913C337.743 -5.37771 325.856 -5.17321 269.202 -4.05431C267.727 -4.02516 266.247 -3.99491 264.765 -3.9636ZM32.447 9.33767C32.2116 9.38175 31.9784 9.42615 31.7475 9.47091C31.1793 9.34847 30.6144 9.22041 30.0552 9.08704C30.8571 9.16416 31.6558 9.24795 32.447 9.33767ZM17.4977 3.75224C18.7677 3.60239 20.2518 3.46815 21.9947 3.34694C18.7841 3.15886 17.4035 3.2445 17.4977 3.75224Z" fill="#BAD9FF" />
              </svg>
              <span className="relative z-10">Growth Intelligence</span>
            </span>{' '}
            for Your <br className='md:block hidden'/> Business.
          </h2>
          <p className="mx-auto mt-5 max-w-[760px] text-[15px] leading-[1.5] tracking-[0.01em] text-[#65728A] md:text-xl">
            {description}
            
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[30px] bg-[#E9EAEC] p-1 md:mt-16 lg:grid lg:grid-cols-[39%_61%]">
          <div className="flex min-h-[500px] flex-col rounded-[26px] bg-gradient-to-br from-[#003153] to-[#003153] px-7 py-8 text-white md:px-9 md:py-10 lg:min-h-[780px]">
            <h3 className="max-w-[420px] text-xl font-normal leading-[1.12] tracking-wide md:text-3xl">
              {growthIntelligenceTitle}
              
            </h3>
            <p className="mt-6 max-w-[430px] text-[16px] leading-[1.45] tracking-wide text-[#BBBEC2] md:text-[20px]">
              {growthIntelligenceDescription}
              
            </p>
            <Link
              href="/search"
              className="mt-auto inline-flex w-fit items-center gap-3 rounded-md bg-[#3C89B1C7] px-5 py-3 text-[15px text-white transition-colors tracking-wide hover:bg-[#3B93BD] md:text-base"
            >
              {growthIntelligenceButtonLabel}
              
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid gap-1 pt-1 sm:grid-cols-2 lg:pl-1 lg:pt-0">
            {growthCards.map((card) => {

              return (
                <article
                  key={card.title}
                  className="flex min-h-[460px] flex-col rounded-[28px] bg-[radial-gradient(circle_at_top_right,#DDF1FF_0%,#F8FCFF_43%,#FFFFFF_72%)] p-7 md:min-h-[520px] md:p-8 lg:min-h-0"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-[6px] bg-[#E8F2FF] text-[#00395D]">
                    {card.icon}
                  </div>
                  <div className="mt-auto pt-20">
                    <h3 className="text-[25px] font-medium leading-[1.12] tracking-wide text-[#07142D] md:text-xl">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-[16px] leading-[1.42] tracking-wide text-[#7A8596] md:text-base">
                      {card.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
