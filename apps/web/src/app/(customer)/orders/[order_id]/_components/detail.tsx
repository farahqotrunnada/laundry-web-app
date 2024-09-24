'use client';

import * as React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn, formatCurrency, relativeTime } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import DetailList from '@/components/detail-list';
import Image from 'next/image';
import Loader from '@/components/loader/loader';
import { OrderStatusMapper } from '@/lib/constant';
import { useOrderDetail } from '@/hooks/use-order-detail';

interface ComponentProps {
  order_id: string;
}

const OrderDetail: React.FC<ComponentProps> = ({ order_id, ...props }) => {
  const { data, error, isLoading } = useOrderDetail(order_id);

  if (isLoading) return <Loader />;
  if (error || !data) return <div>failed to load order data, retrying...</div>;

  return (
    <div className='grid items-start gap-8 '>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-bold'>Outlet Detail</CardTitle>
          <CardDescription>All the details of the outlet.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className='flex flex-col space-y-4 text-sm'>
            <DetailList title='Order ID' data={data.data.order_id.toUpperCase()} />
            <DetailList title='Customer Name' data={data.data.Customer.User.fullname} />
            <DetailList title='Customer Email' data={data.data.Customer.User.email} />
            <DetailList title='Customer Address' data={data.data.CustomerAddress.address} />
            <DetailList title='Outlet Name' data={data.data.Outlet.name} />
            <DetailList title='Outlet Address' data={data.data.Outlet.address} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-bold'>Order Fee</CardTitle>
          <CardDescription>All the details of order fee.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col space-y-4 text-sm'>
            <DetailList title='Weight' data={Number(data.data.weight || 0) + ' kg'} />
            <DetailList title='Laundry Fee' data={formatCurrency(data.data.laundry_fee)} />
            <DetailList title='Delivery Fee' data={formatCurrency(data.data.delivery_fee)} />
            <DetailList
              title='Total'
              data={formatCurrency(Number(data.data.laundry_fee) + Number(data.data.delivery_fee))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-bold'>Order Progress</CardTitle>
          <CardDescription>Monitor your order progress.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='relative flex flex-col space-y-4'>
            {data.data.OrderProgress.map((item, idx) => (
              <div key={idx} className='flex items-center text-sm lg:space-x-4'>
                <div
                  className={cn(
                    'hidden lg:flex items-center justify-center flex-none font-bold rounded-full size-8 aspect-square bg-muted',
                    idx === data.data.OrderProgress.length - 1 && 'text-white bg-primary'
                  )}>
                  {idx + 1}
                </div>
                <div className='flex flex-col items-start w-full space-y-1 lg:space-y-0 lg:items-center lg:justify-between lg:flex-row'>
                  <span className='font-medium'>{OrderStatusMapper[item.status]}</span>
                  <Badge variant='outline'>{relativeTime(item.created_at)}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-bold'>Order Items</CardTitle>
          <CardDescription>Monitor your order items details.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className='border rounded-md'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className='text-right'>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.OrderItem.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className='h-20 text-center'>
                      No results.
                    </TableCell>
                  </TableRow>
                )}
                {data.data.OrderItem.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.LaundryItem.name}</TableCell>
                    <TableCell className='text-right'>{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-bold'>Order Payment</CardTitle>
          <CardDescription>All the details of the order payment.</CardDescription>
        </CardHeader>
        <CardContent>
          {!data.data.Payment && (
            <div className='flex items-center justify-center w-full h-52'>
              <div className='flex flex-col items-center justify-center'>
                <div className='text-center'>
                  <p className='font-medium'>Continue payment</p>
                  <p className='text-sm text-muted-foreground'>
                    Please complete your payment with your preferred payment method.
                  </p>
                </div>
              </div>
            </div>
          )}

          {data.data.Payment && (
            <div className='flex flex-col space-y-4 text-sm'>
              <DetailList title='Payment ID' data={data.data.Payment.payment_id.toUpperCase()} />
              <DetailList title='Payment Status' data={data.data.Payment.status} />
              <DetailList title='Payment Method' data={data.data.Payment.method} />
              <DetailList title='Created' data={relativeTime(data.data.Payment.created_at)} />
              <DetailList title='Updated' data={relativeTime(data.data.Payment.updated_at)} />
              {data.data.Payment.receipt_url && (
                <div className='flex flex-col space-y-4 text-sm'>
                  <span className='text-sm'>Receipt</span>
                  <Image
                    src={data.data.Payment.receipt_url}
                    width={300}
                    height={300}
                    alt='Receipt'
                    className='object-cover w-full rounded-lg aspect-square'
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetail;
