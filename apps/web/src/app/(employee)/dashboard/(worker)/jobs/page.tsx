import * as React from 'react';

import JobTable from './_components/table';

interface PageProps {
  //
}

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <>
      <div className='flex flex-col items-start space-y-2'>
        <h2 className='text-4xl font-bold'>Jobs Page</h2>
        <p className='leading-relaxed tracking-tight text-left text-muted-foreground'>
          Manage and track job assignments efficiently. Monitor progress, worker tasks, and job types in real-time, with options to view detailed job information and start pending jobs seamlessly.
        </p>
      </div>

      <JobTable />
    </>
  );
}
