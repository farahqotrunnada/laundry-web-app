'use client';

import * as React from 'react';

import Loader from '@/components/loader/loader';
import { useShifts } from '@/hooks/use-shifts';
import ShiftCard from './card';
import CreateShiftModal from './create-modal';

interface ShiftGridProps {
  //
}

const ShiftGrid: React.FC<ShiftGridProps> = ({ ...props }) => {
  const { data, error, isLoading } = useShifts();

  if (isLoading) return <Loader />;
  if (error || !data) return <div>Failed to load shifts, retrying...</div>;

  return (
    <div className='w-full'>
      <div className='flex flex-col mb-6 space-y-4 lg:justify-between lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4'>
        <div className='flex flex-col items-center w-full space-x-2 space-y-4 lg:w-auto lg:flex-row lg:space-y-0 lg:space-x-4'>
          <CreateShiftModal />
        </div>
      </div>

      {data.data.length === 0 && <div>No shifts found.</div>}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {data.data.map((shift) => (
          <ShiftCard key={shift.shift_id} shift={shift} />
        ))}
      </div>
    </div>
  );
};

export default ShiftGrid;
