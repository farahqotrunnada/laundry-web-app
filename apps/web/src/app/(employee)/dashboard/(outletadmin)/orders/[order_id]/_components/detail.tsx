'use client';

import * as React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate, formatDateTime } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { useOrderDetail } from '@/hooks/use-order-detail';

interface ComponentProps {
  order_id: string;
}

const OrderDetail: React.FC<ComponentProps> = ({ order_id, ...props }) => {
  const { data, error, isLoading } = useOrderDetail(order_id);

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>failed to load order data, retrying...</div>;

  return (
    <div className='grid items-start gap-8 lg:grid-cols-5'>
      <div className='flex flex-col gap-8 lg:col-span-3'>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl font-bold'>Outlet Detail</CardTitle>
            <CardDescription>Make sure to add all the details of your outlet.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className='grid gap-4'>
              <div className='flex flex-col space-y-4 text-sm'>
                <div className='flex w-full space-x-2 items-bottom'>
                  <span className='flex-none'>Order ID</span>
                  <div className='w-full border-b border-dotted border-muted-foreground'></div>
                  <span className='flex-none uppercase text-muted-foreground'>{order_id}</span>
                </div>

                <div className='flex w-full space-x-2 items-bottom'>
                  <span className='flex-none'>Customer Name</span>
                  <div className='w-full border-b border-dotted border-muted-foreground'></div>
                  <span className='flex-none text-muted-foreground'>{data.data.Customer.User.fullname}</span>
                </div>

                <div className='flex w-full space-x-2 items-bottom'>
                  <span className='flex-none'>Customer Email</span>
                  <div className='w-full border-b border-dotted border-muted-foreground'></div>
                  <span className='flex-none text-muted-foreground'>{data.data.Customer.User.email}</span>
                </div>

                <div className='flex w-full space-x-2 items-bottom'>
                  <span className='flex-none'>Outlet Name</span>
                  <div className='w-full border-b border-dotted border-muted-foreground'></div>
                  <span className='flex-none text-muted-foreground'>{data.data.Outlet.name}</span>
                </div>

                <div className='flex w-full space-x-2 items-bottom'>
                  <span className='flex-none'>Outlet Address</span>
                  <div className='w-full border-b border-dotted border-muted-foreground'></div>
                  <span className='flex-none text-muted-foreground'>{data.data.Outlet.address}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-xl font-bold'>Order Progress</CardTitle>
            <CardDescription>Manage your order progress.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='relative flex flex-col space-y-4'>
              {data.data.OrderProgress.map((item, idx) => (
                <div key={idx} className='flex items-center space-x-4 text-sm'>
                  <div className='flex items-center justify-center flex-none font-bold rounded-full size-10 aspect-square bg-muted'>
                    {idx + 1}
                  </div>
                  <div className='flex items-center justify-between w-full'>
                    <span className='font-medium'>{item.name}</span>
                    <Badge variant='outline' className='text-sm'>
                      {formatDateTime(item.created_at)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='flex flex-col gap-8 lg:col-span-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl font-bold'>Order Items</CardTitle>
            <CardDescription>Make sure to add all the details of your outlet.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className='border rounded-md'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className='text-right'>Weight</TableHead>
                    <TableHead className='text-right'>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.OrderItem.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.LaundryItem.name}</TableCell>
                      <TableCell className='text-right'>{item.weight} kg</TableCell>
                      <TableCell className='text-right'>{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetail;
