import Application from '@/layouts/application/application';
import { Button } from '@/components/ui/button';
import Illustration from '@/components/illustration';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Application>
      <div className='container'>
        <div className='flex flex-col items-center justify-center py-20 space-y-4'>
          <div className='w-full max-w-lg'>
            <Illustration />
          </div>
          <h1 className='text-4xl font-bold text-center'>Page Not Found</h1>
          <p className='max-w-lg text-sm text-center text-muted-foreground'>
            Oops! The page you are looking for doesn&apos;t exist, please check the URL and try again, or contact our
            support team at{' '}
            <a href='mailto:support@laundry.app' className='text-primary'>
              support@laundry.app
            </a>
          </p>
          <Link href='/'>
            <Button>Back to home</Button>
          </Link>
        </div>
      </div>
    </Application>
  );
}
