import * as React from 'react';

import { PROJECT_NAME, SIDEBAR_LINKS } from '@/lib/constant';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import AppIcon from '@/components/app-icon';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import SidebarLink from '@/layouts/dashboard/sidebar/sidelink';
import SidebarCard from './card';

interface DrawerProps {
  //
}

const SidebarDrawer: React.FC<DrawerProps> = ({ ...props }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='outline' size='icon' className='shrink-0 lg:hidden'>
          <Menu className='size-5' />
          <span className='sr-only'>Toggle navigation menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side='left' className='flex flex-col'>
        <Link href='/' className='flex items-center gap-2 px-3 text-lg font-semibold'>
          <AppIcon className='w-6 h-6' />
          <span>{PROJECT_NAME}</span>
        </Link>

        <nav className='grid items-start gap-1 mt-6 overflow-y-auto text-sm font-medium hide-scrollbar'>
          {SIDEBAR_LINKS.map((link) => (
            <SidebarLink
              key={link.title}
              link={link}
              onClick={() => {
                setOpen(false);
              }}
            />
          ))}
        </nav>

        <div className='mt-auto'>
          <SidebarCard />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SidebarDrawer;
