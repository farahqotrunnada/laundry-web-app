import * as React from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { Badge } from '@/components/ui/badge';
import { POLICIES } from '@/lib/constant';

interface PageProps {
  //
}

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <div className='grid gap-8 py-5'>
      <div className='flex flex-col items-start space-y-2' data-aos='fade-up' data-aos-delay={100}>
        <Badge>Privacy policy</Badge>
        <h1 className='mb-4 text-5xl font-bold'>LaundryXpert Privacy Policy</h1>
        <p className='text-sm text-muted-foreground'>
          At LaundryXpert, we prioritize your privacy and are committed to protecting your personal data. This Privacy
          Policy outlines how we collect, use, and safeguard your information when you use our platform.
        </p>
      </div>

      <Accordion type='single' collapsible className='w-full'>
        {POLICIES.map((item, index) => {
          const Icon = item.icon;

          return (
            <AccordionItem value={index.toString()} key={index} data-aos='fade-up' data-aos-delay={100 + index * 100}>
              <AccordionTrigger className='hover:no-underline hover:text-primary'>
                <div className='flex items-center gap-4'>
                  <Icon className='size-5' />
                  <span>{item.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className='text-muted-foreground'>{item.content}</p>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <div
        className='flex flex-col items-start space-y-4'
        data-aos='fade-up'
        data-aos-delay={100 + POLICIES.length * 100}>
        <h2 className='text-xl font-bold'>How We Use Your Information</h2>
        <ul className='pl-5 space-y-2 text-sm list-disc text-muted-foreground'>
          <li>To process your orders and provide our services.</li>
          <li>To improve our app performance and user experience.</li>
          <li>To send notifications regarding your orders and promotions.</li>
        </ul>
      </div>

      <div
        className='flex flex-col items-start space-y-4'
        data-aos='fade-up'
        data-aos-delay={200 + POLICIES.length * 100}>
        <p className='text-sm text-muted-foreground'>
          We do not sell or share your personal information with third parties without your consent, except as required
          by law. For more information on how we handle your data, please feel free to contact us.
        </p>
      </div>
    </div>
  );
}
