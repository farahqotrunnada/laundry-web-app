import * as React from 'react';

import ComplaintTable from './_components/table';

interface PageProps {
  //
}

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <>
      <div className='flex flex-col items-start space-y-2'>
        <h2 className='text-4xl font-bold'>Complaint Page</h2>
        <p className='leading-relaxed tracking-tight text-left text-muted-foreground'>
          Manage customer complaints efficiently. View, edit, and resolve customer issues, ensuring prompt responses and
          maintaining high customer satisfaction by addressing concerns quickly
        </p>
      </div>

      <ComplaintTable />
    </>
  );
}
