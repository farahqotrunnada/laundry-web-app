import * as React from 'react';

import Footer from '@/layouts/application/footer';
import Header from '@/layouts/application/header/header';
import { NavigationItem } from '@/types/navigation';
import { cn } from '@/lib/utils';

interface ApplicationProps extends React.PropsWithChildren {
  containerized?: boolean;
}

export default async function Application({
  children,
  containerized = true,
}: ApplicationProps): Promise<React.JSX.Element> {
  const menus: NavigationItem[] = [
    {
      title: 'Help & Support',
      description: 'Clean Clothes with LaundryXpert',
      items: [
        {
          title: 'FAQ',
          href: '/faq',
          description: 'Frequently Ask Questions',
        },
        {
          title: 'Partnership',
          href: '/partnership',
          description: 'Explore opportunities to collaborate and grow with us through strategic partnerships.',
        },
      ],
    },
    {
      title: 'About',
      description: 'Clean Clothes with LaundryXpert',
      items: [
        { title: 'About us', href: '/about' },
        { title: 'Privacy Policy', href: '/privacy-policy' },
        { title: 'Terms of Service', href: '/terms-of-service' },
      ],
    },
  ];

  return (
    <>
      <Header menus={menus} />
      <main className={cn('min-h-screen py-10', containerized && 'container')}>{children}</main>
      <Footer menus={menus} />
    </>
  );
}
