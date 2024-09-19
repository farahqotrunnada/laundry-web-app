import * as React from 'react';
import ShiftGrid from './_components/grid';

interface PageProps {
  //
}

export default async function Page({ ...props }: PageProps): Promise<React.JSX.Element> {
  return (
    <>
      <div className='flex flex-col items-start space-y-2'>
        <h2 className='text-4xl font-bold'>Shift Page</h2>
        <p className='leading-relaxed tracking-tight text-left text-muted-foreground'>
          View and manage employee shifts in the company, this shift is for the employee to work on the outlet.
        </p>
      </div>

      <ShiftGrid />
    </>
  );
}
