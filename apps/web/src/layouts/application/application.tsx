import * as React from 'react';

import Footer from '@/layouts/application/footer';
import Header from '@/layouts/application/header/header';
import { cn } from '@/lib/utils';

interface ApplicationProps extends React.PropsWithChildren {
  containerized?: boolean;
}

export default async function Application({
  children,
  containerized = true,
}: ApplicationProps): Promise<React.JSX.Element> {
  return (
    <>
      <Header />
      <main className={cn('min-h-screen py-10', containerized && 'container')}>{children}</main>
      <Footer />
    </>
  );
}
