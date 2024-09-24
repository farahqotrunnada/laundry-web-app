import * as React from 'react';

import LaundryItemGrid from './_components/grid';

interface PageProps {
  //
}

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <>
      <div className='flex flex-col items-start space-y-2'>
        <h2 className='text-4xl font-bold'>Laundry Items Page</h2>
        <p className='leading-relaxed tracking-tight text-left text-muted-foreground'>
          Effortlessly manage your laundry items. Add, track, and update clothing categories with ease to keep your operations running smoothly.
        </p>
      </div>

      <LaundryItemGrid />
    </>
  );
}
