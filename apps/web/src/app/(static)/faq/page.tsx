import * as React from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { Badge } from '@/components/ui/badge';
import { FAQS } from '@/lib/constant';
import Link from 'next/link';

interface PageProps {
  //
}

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <div className='grid gap-8 py-5'>
      <div className='flex flex-col items-start space-y-2' data-aos='fade-up' data-aos-delay={100}>
        <Badge>FAQ</Badge>
        <h1 className='mb-4 text-5xl font-bold'>Frequently Asked Questions</h1>
        <p className='text-sm text-muted-foreground'>
          Find answers to common questions about LaundryXpert services. If you can't find what you're looking for,
          please contact our customer support.
        </p>
      </div>

      <Accordion type='single' collapsible className='w-full'>
        {FAQS.map((faq, index) => {
          const Icon = faq.icon;

          return (
            <AccordionItem value={index.toString()} key={index} data-aos='fade-up' data-aos-delay={100 + index * 100}>
              <AccordionTrigger className='hover:no-underline hover:text-primary'>
                <div className='flex items-center gap-4'>
                  <Icon className='size-5' />
                  <span>{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className='text-muted-foreground'>{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <div className='flex flex-col items-start space-y-4' data-aos='fade-up' data-aos-delay={100 + FAQS.length * 100}>
        <h2 className='text-xl font-bold'>Still have questions?</h2>
        <p className='text-sm text-muted-foreground'>
          If you couldn't find the answer to your question in our FAQ, please don't hesitate to reach out to our
          customer support team. We're here to help! contat us at{' '}
          <Link href='mailto:support@Laundryxpert.online' className='text-primary'>
            support@Laundryxpert.online
          </Link>
        </p>
      </div>
    </div>
  );
}
