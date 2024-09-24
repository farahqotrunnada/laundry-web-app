'use client';

import Image from 'next/image';
import { useTimer } from 'react-timer-hook';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const coming = '/static/img-soon.svg';

function TimerBox({ count, label }: { count: number; label: string }) {
  return (
    <div className='bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg w-20 sm:w-24 flex justify-center items-center'>
      <div>
        <p className='text-2xl sm:text-4xl font-bold text-center text-gray-900 dark:text-gray-100'>{count}</p>
        <p className='text-center text-gray-600 dark:text-gray-300'>{label}</p>
      </div>
    </div>
  );
}

export default function ComingSoon() {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 3600 * 24 * 2 - 3600 * 15.5);

  const { seconds, minutes, hours, days } = useTimer({ expiryTimestamp: time });

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-wrap justify-center items-center'>
          <div className='w-full md:w-1/2 mb-8 md:mb-0'>
            <div className='mx-auto max-w-xs md:max-w-md'>
              <Image src={coming} alt='Coming Soon' width={490} height={420} className='w-full h-auto' />
            </div>
          </div>
          <div className='w-full md:w-1/2 flex flex-col items-center'>
            <div className='text-center mb-6'>
              <h1 className='text-4xl md:text-5xl font-extrabold mb-4 whitespace-nowrap'>Coming Soon</h1>
              <p className='text-gray-600 dark:text-gray-400'>Something new is on its way</p>
            </div>

            <div className='flex space-x-4 mb-6'>
              <TimerBox count={days} label='Day' />
              <TimerBox count={hours} label='Hour' />
              <TimerBox count={minutes} label='Min' />
              <TimerBox count={seconds} label='Sec' />
            </div>

            <div className='w-full max-w-sm'>
              <div className='flex justify-center'>
                <Link href='/'>
                  <Button>Back to home</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
