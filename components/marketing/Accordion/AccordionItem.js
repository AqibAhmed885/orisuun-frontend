import Image from "next/image";
import dropdownArrow from "../../../public/contact-svgs/dropdownArrowDown.svg";
import dropdownArrowBlue from "../../../public/contact-svgs/dropdownArrowDownBlue.svg";
import Link from "next/link";

 const renderContent = (text) => {
    const parts = text.split(/(\[.*?\]\(.*?\)|\n|[^\s@]+@[^\s@]+\.[^\s@]+)/g); // Split text by markdown-like links, newlines, and email addresses
    return parts.map((part, index) => {
      if (part.match(/\[.*?\]\(.*?\)/)) {
        const linkText = part.match(/\[(.*?)\]/)[1];
        const linkHref = part.match(/\((.*?)\)/)[1];
        return linkHref.startsWith("/") || linkHref.startsWith("http") ? (
          <Link key={index} href={linkHref} className="text-white underline underline-offset-3">
            {linkText}
          </Link>
        ) : (
          <a key={index} href={linkHref} className="text-white underline">
            {linkText}
          </a>
        );
      } else if (part === "\n") {
        return <br key={index} />;
      } else if (part.match(/[^\s@]+@[^\s@]+\.[^\s@]+/)) {
        return (
          <Link
            key={index}
            href={`mailto:${part}`}
            className="text-blue-500 underline"
          >
            {part}
          </Link>
        );
      } else {
        return part;
      }
    });
  };

const AccordionItem = ({ faq, onClick, isOpen, index, titleClass, blue }) => (
  <div>
    <div
      onClick={onClick}
      className={`border-b border-blue-200 border-opacity-10 flex items-center justify-between ${isOpen ? "pb-3 border-none" : "pb-[32px]"} ${index} cursor-pointer ${index === 0 ? "pt-0" : "pt-[32px]"}`}
    >
      <p className={titleClass}>{faq?.title}</p>
      {
        blue ? <Image
          alt="dropdown"
          src={dropdownArrowBlue}
          width={20}
          height={20}
          className={`transition-transform ${isOpen ? "rotate-180" : ""} shrink-0 w-5 h-5`}
        /> : <Image
          alt="dropdown"
          src={dropdownArrow}
          width={20}
          height={20}
            className={`transition-transform ${isOpen ? "rotate-180" : ""} shrink-0 w-5 h-5`}
        />
      }
    </div>

    {isOpen && (
      <div
        className={`w-full ${blue ? 'text-[#5B657B]' : 'text-white shadow-lg opacity-70'} font-normal p-2 border-b border-blue-200 border-opacity-10 rounded-md leading-150 transition duration-150 ease-in-out tracking-wider`}

      >  {renderContent(faq.content)}</div>
    )}
  </div>
);

export default AccordionItem;
