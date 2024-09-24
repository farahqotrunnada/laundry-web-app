import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';

import { ABOUT_FEATURE } from '@/lib/constant';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import LaundryXpert from '/public/features/feature3.jpg';
import Sign from '/public/static/signature.png';

interface PageProps {
  //
}

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <div className='grid gap-8 py-5'>
      <div className='grid items-center gap-8 lg:grid-cols-2'>
        <div className='flex flex-col items-start space-y-4' data-aos='fade-up' data-aos-delay={100}>
          <Badge>About Us</Badge>
          <h1 className='text-5xl font-bold '>Learn More About Us</h1>
          <p className='text-sm leading-relaxed text-muted-foreground'>
            LaundryXpert was born out of a simple idea: to make laundry day a breeze for everyone. Founded in 2024 by a
            group of tech enthusiasts and laundry experts, we set out to combine cutting-edge technology with top-notch
            laundry services. Our journey began in a small garage and has now grown to multiple outlets across the city,
            serving thousands of satisfied customers daily.
            <br />
            <br />
            At LaundryXpert, our mission is to give you back your precious time by taking care of your laundry needs. We
            believe that clean, fresh clothes shouldn't come at the cost of your leisure time. By providing an
            efficient, reliable, and high-quality laundry service, we aim to make your life easier and more enjoyable,
            one load at a time.
          </p>
          <Image src={Sign} alt='Signature' width={100} height={100} className='w-full max-w-28' />
        </div>

        <div
          className='order-first p-4 border rounded-full aspect-square lg:order-last'
          data-aos='fade-up'
          data-aos-delay={200}>
          <Image
            src={LaundryXpert}
            alt='Coming Soon'
            width={1000}
            height={1000}
            className='object-cover object-center w-full rounded-full aspect-square'
          />
        </div>
      </div>

      <div data-aos='fade-up'>
        <h2 className='mb-6 pt-4 text-3xl font-bold'>What We Offer</h2>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {ABOUT_FEATURE.map((feature, index) => (
            <Card key={index} data-aos='fade-up' data-aos-delay={200 + index * 100}>
              <CardContent className='flex flex-col p-6 space-y-2'>
                <feature.icon className='size-5 text-primary' />
                <h3 className='font-medium'>{feature.title}</h3>
                <p className='text-sm text-muted-foreground'>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div data-aos='fade-up' data-aos-delay={400}>
        <h2 className='mb-6 text-3xl font-bold'>Our Commitment</h2>
        <p className='text-muted-foreground'>
          At LaundryXpert, we're committed to providing more than just clean clothes. We're dedicated to:
        </p>
        <ul className='pl-6 mt-4 space-y-2 list-disc text-muted-foreground'>
          <li>Exceptional customer service that goes above and beyond</li>
          <li>Continuous innovation to improve our services and user experience</li>
          <li>Maintaining the highest standards of cleanliness and hygiene</li>
          <li>Supporting our local communities through various initiatives</li>
          <li>Reducing our environmental impact through sustainable practices</li>
        </ul>
      </div>
    </div>
  );
}
