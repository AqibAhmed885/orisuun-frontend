import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
const BOOKING_UI_IMAGE = `${staticUrl}/homepage-new/tabs/business/booking.svg`;

export default function BookingHero({
  subtitle = "Booking for Strategy Consultants",
  title = "The High-Impact Advisory for the Modern Consultant" as ReactNode,
  description = "Stay sharp, stay connected, and get paid for your expertise - outside the firm. Open your calendar to Black-owned businesses across the SMB spectrum for high-stakes, timed strategy sessions. Impact where it matters; income on your own terms.",
  ctaPrimary = "Open Your Digital Practice",
  ctaSecondary = "How we protect your billable time",
  linkPrimary = "/signup",
  linkSecondary = "/consultant-booking-faq",
  imageSrc = BOOKING_UI_IMAGE,
  mobileImageSrc = BOOKING_UI_IMAGE,
  contentCentered = true,
  imageFit = "cover",
  mobileImageFit = "cover",
  hideSecondaryOnMobile = false,
  vertical = false,
  flushTop = false,
  imagePosition = "center",
  contentClassName = "",
  ctaClassName = "",
  mobileImageContainerClassName = "",
}) {
  const positionClass = imagePosition === "top" ? "object-top" : "object-center";

  const desktopImageClasses =
    imageFit === "contain"
      ? `object-contain ${positionClass}`
      : "object-cover object-left-top";

  const mobileImageClasses =
    mobileImageFit === "contain"
      ? `object-contain ${positionClass}`
      : "object-cover object-center";

  const verticalSectionClass = flushTop
    ? "relative overflow-hidden"
    : "relative mt-16 overflow-hidden md:mt-[84px]";

  const horizontalSectionClass = flushTop
    ? "relative min-h-screen overflow-hidden"
    : "relative mt-16 min-h-screen overflow-hidden md:mt-[84px]";

  if (vertical) {
    return (
      <section className={verticalSectionClass}>
        <div className="mx-auto flex h-[874px] w-full max-w-[402px] flex-col pt-[10px] md:h-[832px] md:w-[1280px] md:max-w-none">
          <div
            className={
              contentCentered
                ? "flex flex-none items-center justify-center px-6 py-4 sm:px-10"
                : "flex flex-none items-end px-6 pb-14 pt-10 sm:px-10"
            }
          >
            <div className="max-w-[900px]">
              <p className="text-base font-semibold text-[#004b7a]">
                {subtitle}
              </p>

              <h1 className="mt-6 text-[32px] font-normal leading-[1.02] tracking-normal text-[#030b24] md:text-[56px]">
                {title}
              </h1>

              <p className="mt-4 max-w-[870px] text-sm leading-[1.45] text-[#627089] sm:text-base">
                {description}
              </p>

              <div className="mt-6 flex flex-col gap-4 sm:mt-10 sm:flex-row">
                <Link
                  href={linkPrimary}
                  className="inline-flex h-[45px] items-center justify-center rounded-[7px] bg-[#00395d] px-8 text-sm text-white transition hover:bg-[#07527f]"
                >
                  {ctaPrimary}
                </Link>

                <Link
                  href={linkSecondary}
                  className={`inline-flex h-[45px] items-center justify-center rounded-[7px] border border-[#00395d] px-8 text-sm text-[#00395d] transition hover:bg-[#eef7ff] ${
                    hideSecondaryOnMobile ? "hidden sm:inline-flex" : ""
                  }`}
                >
                  {ctaSecondary}
                </Link>
              </div>
            </div>
          </div>

          <div className="relative min-h-0 flex-1 w-full">
            <Image
              src={imageSrc}
              alt="Consultant booking dashboard schedule setup"
              fill
              priority
              sizes="(max-width: 768px) 402px, 1280px"
              className="object-contain object-center"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={horizontalSectionClass}>
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[50%_50%]">
        <div
          className={
            contentCentered
              ? `flex items-center px-6 py-4 sm:px-10 lg:py-28 lg:pl-16 ${contentClassName}`
              : `flex items-end px-6 pb-14 pt-10 sm:px-10 lg:pb-28 lg:pl-16 ${contentClassName}`
          }
        >
          <div className="max-w-[900px]">
            <p className="text-base font-semibold text-[#004b7a]">
              {subtitle}
            </p>

            <h1 className="mt-6 text-[32px] font-normal leading-[1.02] tracking-normal text-[#030b24] md:text-[56px]">
              {title}
            </h1>

            <p className="mt-4 max-w-[870px] text-sm leading-[1.45] text-[#627089] sm:text-base">
              {description}
            </p>

            <div className={`mt-10 flex flex-col gap-4 sm:mt-14 sm:flex-row ${ctaClassName}`}>
              <Link
                href={linkPrimary}
                className="inline-flex h-[45px] items-center justify-center rounded-[7px] bg-[#00395d] px-8 text-sm text-white transition hover:bg-[#07527f]"
              >
                {ctaPrimary}
              </Link>

              <Link
                href={linkSecondary}
                className={`inline-flex h-[45px] items-center justify-center rounded-[7px] border border-[#00395d] px-8 text-sm text-[#00395d] transition hover:bg-[#eef7ff] ${
                  hideSecondaryOnMobile ? "hidden sm:inline-flex" : ""
                }`}
              >
                {ctaSecondary}
              </Link>
            </div>
          </div>
        </div>

        <div className="relative min-h-[480px] w-full sm:min-h-[480px] lg:min-h-screen md:block hidden">
          <Image
            src={imageSrc}
            alt="Consultant booking dashboard schedule setup"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={desktopImageClasses}
          />
        </div>

        <div className={`relative min-h-[250px] w-full md:hidden block ${mobileImageContainerClassName}`}>
          <Image
            src={mobileImageSrc || imageSrc}
            alt="Consultant booking dashboard schedule setup"
            fill
            priority
            sizes="100vw"
            className={mobileImageClasses}
          />
        </div>
      </div>
    </section>
  );
}
