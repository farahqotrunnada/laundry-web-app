import AppIcon from '@/components/app-icon';
import Background from '@/assets/background.jpg';
import Image from 'next/image';
import Link from 'next/link';
import { PROJECT_NAME } from '@/lib/constant';
import React from 'react';

interface AuthProps extends React.PropsWithChildren {
  //
}

const AuthLayout: React.FC<AuthProps> = ({ children }) => {
  return (
    <div className='relative w-full h-screen lg:grid lg:grid-cols-2'>
      <Link href='/' className='absolute top-0 left-0 flex items-center gap-2 font-semibold m-7'>
        <AppIcon className='w-6 h-6' />
        <span className=' whitespace-nowrap'>{PROJECT_NAME}</span>
      </Link>

      <div className='container flex items-center justify-center h-full py-12 lg:h-auto'>
        <div className='mx-auto w-96'>{children}</div>
      </div>

      <div className='hidden overflow-hidden bg-muted lg:block'>
        <Image
          src={Background}
          alt='Image'
          width='1920'
          height='1080'
          placeholder='blur'
          className='h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
        />
      </div>
    </div>
  );
};

export default AuthLayout;
