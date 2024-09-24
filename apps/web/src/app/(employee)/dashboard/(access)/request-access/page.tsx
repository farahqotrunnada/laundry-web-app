import * as React from 'react';

import RequestAccessTable from './_components/table';

interface PageProps {
  //
}

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <>
      <div className='flex flex-col items-start space-y-2'>
        <h2 className='text-4xl font-bold'>Request Access Page</h2>
        <p className='leading-relaxed tracking-tight text-left text-muted-foreground'>
          Efficiently manage request access for resolving laundry item quantity discrepancies. Ensuring accurate tracking and timely resolution through open discussions.
        </p>
      </div>

      <RequestAccessTable />
    </>
  );
}
