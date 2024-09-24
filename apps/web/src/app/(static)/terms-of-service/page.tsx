import * as React from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { Badge } from '@/components/ui/badge';
import { TERMS } from '@/lib/constant';

interface PageProps {
  //
}

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <div className='grid gap-8 py-5'>
      <div className='flex flex-col items-start space-y-2' data-aos='fade-up' data-aos-delay={100}>
        <Badge>Terms of Service</Badge>
        <h1 className='mb-4 text-5xl font-bold'>LaundryXpert Terms of Service</h1>
        <p className='text-sm text-muted-foreground'>
          By using LaundryXpert, you agree to the following terms and conditions. Please read these terms carefully
          before using our services.
        </p>
      </div>

      <Accordion type='single' collapsible className='w-full'>
        {TERMS.map((item, index) => {
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

      <div className='flex flex-col items-start space-y-4' data-aos='fade-up' data-aos-delay={100 + TERMS.length * 100}>
        <h2 className='text-xl font-bold'>Additional Information</h2>
        <ul className='pl-5 space-y-2 text-sm list-disc text-muted-foreground'>
          <li>LaundryXpert reserves the right to modify these terms at any time.</li>
          <li>Users are responsible for reviewing the terms periodically for changes.</li>
          <li>Continued use of the service after changes constitutes acceptance of the new terms.</li>
        </ul>
      </div>

      <div className='flex flex-col items-start space-y-4' data-aos='fade-up' data-aos-delay={200 + TERMS.length * 100}>
        <p className='text-sm text-muted-foreground'>
          By using our service, you accept these terms. If you do not agree to these terms, please do not use our
          service. For any questions or concerns regarding these terms, please contact our customer support.
        </p>
      </div>
    </div>
  );
}
