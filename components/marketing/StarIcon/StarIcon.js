import Image from "next/image";
import contactStar from "../../../public/contact-svgs/contact-star.svg";

export const StarIcon = ({ className }) => (
  <Image
    alt="contact-img"
    src={contactStar}
    className={`absolute ${className}`}
  />
);
