import Image from 'next/image';
import Hamburger from '@/icons/sidebar/hamburger';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';

interface HeaderProps {
  currentUser: any;
}

const Header: React.FC<HeaderProps> = ({ currentUser }) => (
  <div className="md:hidden flex items-center justify-between py-4">
    <Hamburger className="hamburger-top-icon" />
    <p className="text-h7 2xl:text-scaled-h7 font-semibold text-blue-600">
      Business Development
    </p>
    <Image
      src={
        currentUser?.ProfilePicture ||
        BASE_URL
      }
      alt="user"
      width={32}
      height={32}
      className="rounded-full h-8 w-8 me-2"
    />
  </div>
);

export default Header;