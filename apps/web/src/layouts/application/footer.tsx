import AppIcon from '@/components/app-icon';
import Link from 'next/link';
import { APPLICATION_MENU, PROJECT_NAME } from '@/lib/constant';

interface FooterProps {
  //
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <div className='w-full py-14 lg:py-30 bg-foreground bg-muted dark:bg-background'>
      <div className='container mx-auto'>
        <div className='grid items-center gap-10 lg:grid-cols-2'>
          <div className='flex flex-col items-start gap-8'>
            <div className='flex flex-col gap-2 dark:text-foreground'>
              <Link href='/' className='flex items-center gap-2 text-lg font-semibold'>
                <AppIcon className='w-6 h-6' />
                <span>{PROJECT_NAME}</span>
              </Link>
              <p className='max-w-lg text-sm leading-relaxed tracking-tight text-left text-muted-foreground'>
                Clean Clothes with LaundryXpert. <br />
                Experience the Difference
              </p>
            </div>
            <div className='flex flex-row gap-20'>
              <div className='flex flex-col max-w-lg text-sm leading-relaxed tracking-tight text-left text-muted-foreground'>
                <p>South Quarter Building</p>
                <p>South Jakarta</p>
                <p>Indonesia</p>
              </div>
              <div className='flex flex-col max-w-lg text-sm leading-relaxed tracking-tight text-left text-muted-foreground'>
                <Link href='/'>&copy; Group-5</Link>
              </div>
            </div>
          </div>
          <div className='grid items-start grid-cols-2 gap-10 lg:grid-cols-3'>
            {APPLICATION_MENU.map((item) => (
              <div key={item.title} className='flex flex-col items-start gap-1 text-base'>
                <div className='flex flex-col gap-2'>
                  <span className='font-medium dark:text-foreground'>{item.title}</span>
                  {item.items &&
                    item.items.map((subItem) => (
                      <Link key={subItem.title} href={subItem.href} className='flex items-center justify-between'>
                        <span className='text-sm text-muted-foreground'>{subItem.title}</span>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
