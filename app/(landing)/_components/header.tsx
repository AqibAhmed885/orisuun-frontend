import Link from 'next/link';
import { Search, Bell, MessageCircle, Star } from 'lucide-react';
import Image from 'next/image';

const Header = ({ link = "/signup" }) => {
  return (
    <header className="w-full bg-white">
      <div className="max-w-[1440px]  mx-auto px-4 md:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-20">

            <Image src="/logo.svg" alt="Logo" width={120} height={40} className=""/>
            {/* CTA button */}
            <Link
            href={link}
            className="  items-center px-5 py-2 bg-[#2357C6] text-white text-base font-semibold rounded-full shadow-sm hover:bg-[#1e4bb2] transition"
            >
              Start Free Trial
            </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;