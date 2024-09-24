import * as React from 'react';

import OutletTable from './_components/table';

interface PageProps {
  //
}

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <>
      <div className='flex flex-col items-start space-y-2'>
        <h2 className='text-4xl font-bold'>Outlets Page</h2>
        <p className='leading-relaxed tracking-tight text-left text-muted-foreground'>
          Effortlessly manage your laundry outlets. View, edit, or delete outlet details, and manage employees
          associated with each location to keep your business running smoothly.
        </p>
      </div>

      <OutletTable />
    </>
  );
}
