'use client';

import * as React from 'react';

import Link from 'next/link';
import { SidebarMenu } from '@/types/navigation';
import { cn } from '@/lib/utils';
import { useActivePath } from '@/hooks/use-active-path';
import { useAuth } from '@/hooks/use-auth';

interface SidebarMenuProps extends React.PropsWithChildren {
  link: SidebarMenu;
}

const SidebarLink: React.FC<SidebarMenuProps> = ({ link }) => {
  const active = useActivePath();
  const { user } = useAuth();

  const authorized = React.useMemo(() => {
    if (!user) return false;
    return link.roles.includes(user.role);
  }, [user, link]);

  const Icon = link.icon;

  return (
    <Link
      href={link.href}
      className={cn(
        'items-center gap-3 rounded-lg p-3 text-muted-foreground transition-all hover:text-primary hidden',
        active(link.active || link.href) && 'bg-accent text-foreground hover:text-foreground',
        authorized && 'flex'
      )}>
      <Icon className='size-5' />
      {link.title}
    </Link>
  );
};

export default SidebarLink;
