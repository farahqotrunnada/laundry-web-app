'use client';

import AccountMenu from './account-menu';
import AppIcon from '@/components/app-icon';
import Link from 'next/link';
import { NavigationItem } from '@/types/navigation';
import { PROJECT_NAME } from '@/lib/constant';

interface HeaderProps {
  menus: NavigationItem[];
}

const Header: React.FC<HeaderProps> = ({ menus }) => {
  return (
    <header className='z-40 w-full'>
      <div className='container relative flex flex-row items-center gap-4 min-h-20 lg:grid lg:grid-cols-2'>
        <Link href='/'>
          <div className='flex items-center space-x-2 font-semibold'>
            <AppIcon className='w-6 h-6' />
            <p className=' whitespace-nowrap'>{PROJECT_NAME}</p>
          </div>
        </Link>

        <AccountMenu menus={menus} />
      </div>
    </header>
  );
};

export default Header;
