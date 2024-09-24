'use client';

import * as React from 'react';

import AppMenu from './app-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Notification from '@/layouts/dashboard/notification';
import ThemeToggle from '@/components/theme-toggle';
import UserAvatar from '@/components/user-avatar';
import { useAuth } from '@/hooks/use-auth';
import { getRedirect } from '@/lib/utils';

interface AccountMenuProps {
  //
}

const AccountMenu: React.FC<AccountMenuProps> = () => {
  const { user } = useAuth();

  return (
    <div className='flex justify-end w-full space-x-4'>
      <AppMenu />

      <ThemeToggle />

      {user ? (
        <>
          <Notification />
          <UserAvatar user={user} />
        </>
      ) : (
        <Link href='/auth/login'>
          <Button variant='outline'>Sign in</Button>
        </Link>
      )}

      {user && user.role !== 'Customer' ? (
        <Link href={getRedirect(user.role)} className='hidden md:block'>
          <Button>Dashboard</Button>
        </Link>
      ) : (
        <Link href='/request' className='hidden md:block'>
          <Button>Place Order</Button>
        </Link>
      )}
    </div>
  );
};

export default AccountMenu;
