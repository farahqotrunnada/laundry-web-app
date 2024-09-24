import * as React from 'react';

import Report from './_components/report';

interface PageProps {
  //
}

export default async function Page({}: PageProps): Promise<React.JSX.Element> {
  return (
    <>
      <div className='flex flex-col items-start space-y-2'>
        <h2 className='text-4xl font-bold'>Report Page</h2>
        <p className='leading-relaxed tracking-tight text-left text-muted-foreground'>
          Get clear insights into your business performance. Track orders, employee distribution, and revenue trends with up-to-date, visualized reports.
        </p>
      </div>

      <Report />
    </>
  );
}
