import * as React from 'react';

import DeliveryTable from './_components/table';

interface PageProps {
  //
}

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <>
      <div className='flex flex-col items-start space-y-2'>
        <h2 className='text-4xl font-bold'>Deliveries Page</h2>
        <p className='leading-relaxed tracking-tight text-left text-muted-foreground'>
          Track and manage your deliveries with ease. Monitor pickup and delivery progress, view driver details, and access delivery addresses in real-time for optimized operations.
        </p>
      </div>

      <DeliveryTable />
    </>
  );
}
