'use client';

import { Input } from '@/components/ui/input';
import Notification from './notification';
import { Search } from 'lucide-react';
import SidebarDrawer from '@/layouts/dashboard/sidebar/drawer';
import ThemeToggle from '@/components/theme-toggle';
import UserAvatar from '@/components/user-avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  //
}

const Header: React.FC<HeaderProps> = ({ className, ...props }) => {
  const { user } = useAuth();

  return (
    <header className={cn('flex items-center w-full h-16 gap-4 px-6 border-b bg-card', className)} {...props}>
      <SidebarDrawer />

      <div className='flex items-center space-x-4 ms-auto'>
        <Notification />
        <ThemeToggle />
        {user && <UserAvatar user={user} />}
      </div>
    </header>
  );
};

export default Header;
