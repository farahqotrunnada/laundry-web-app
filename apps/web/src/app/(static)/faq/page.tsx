'use client';

import Link from 'next/link';
import Image from 'next/image';

const construction = '/static/img-cunstruct.svg';
const constructionBottom = '/static/img-cunstruct-bottom.svg';

export default function UnderConstructionPage() {
  return (
    <div className='min-h-screen bg-no-repeat bg-cover flex items-center'>
      <div className='container mx-auto flex flex-col justify-center items-center min-h-screen px-4'>
        <div
          className='w-full flex flex-wrap justify-center items-center py-4 bg-no-repeat bg-bottom'
          style={{ backgroundImage: `url(${constructionBottom})`, backgroundSize: '100%' }}>
          <div className='w-full md:w-1/2 flex flex-col justify-center items-center space-y-4'>
            <h1 className='text-3xl md:text-5xl font-extrabold text-center mb-4 whitespace-nowrap'>
              Under Construction
            </h1>
            <p className='text-gray-600 dark:text-gray-300 text-center w-4/5'>
              Hey! Please check out this page later. We are doing some maintenance on it right now.
            </p>
            <Link href='/' passHref>
              <button className='bg-blue-600 text-white py-2 px-6 rounded-md mt-4 mb-7'>Back To Home</button>
            </Link>
          </div>
          <div className='w-full md:w-1/2 flex justify-center'>
            <Image
              src={construction}
              alt='Under Construction'
              width={396}
              height={370}
              className='w-full max-w-xs md:max-w-md h-auto'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
