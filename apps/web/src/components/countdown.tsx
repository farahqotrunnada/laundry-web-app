'use client';

import { useTimer } from 'react-timer-hook';

function Box({ count, label }: { count: number; label: string }) {
  return (
    <div className='flex flex-col items-center flex-none p-4 text-center border rounded-lg aspect-square'>
      <p className='text-4xl font-bold'>{count}</p>
      <p className='text-sm text-muted-foreground'>{label}</p>
    </div>
  );
}

export default function CountDown() {
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: new Date('2024-09-30'),
  });

  return (
    <div className='grid grid-cols-4 gap-4'>
      <Box count={days} label='Day' />
      <Box count={hours} label='Hour' />
      <Box count={minutes} label='Min' />
      <Box count={seconds} label='Sec' />
    </div>
  );
}
