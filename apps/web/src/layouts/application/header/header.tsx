'use client';

import { useEffect, useState } from 'react';
import AccountMenu from './account-menu';
import AppIcon from '@/components/app-icon';
import Link from 'next/link';
import { PROJECT_NAME } from '@/lib/constant';

interface HeaderProps {
  //
}

const Header: React.FC<HeaderProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`z-40 w-full sticky top-0 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-white dark:bg-[hsl(var(--background))] shadow-lg dark:shadow-[0_4px_10px_rgba(30,30,30,0.8)]'
          : 'bg-white dark:bg-[hsl(var(--background))]'
      }`}>
      <div className='container relative flex flex-row items-center gap-4 min-h-20 lg:grid lg:grid-cols-2'>
        <Link href='/'>
          <div className='flex items-center space-x-2 font-semibold'>
            <AppIcon className='w-6 h-6' />
            <p className='whitespace-nowrap'>{PROJECT_NAME}</p>
          </div>
        </Link>

        <AccountMenu />
      </div>
    </header>
  );
};

export default Header;
