'use client';

import * as React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn, formatCurrency, relativeTime } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import DetailList from '@/components/detail-list';
import Image from 'next/image';
import Loader from '@/components/loader/loader';
import { MapLoader } from '@/components/loader/map';
import { OrderStatusMapper } from '@/lib/constant';
import dynamic from 'next/dynamic';
import { useOrderDetail } from '@/hooks/use-order-detail';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface ComponentProps {
  order_id: string;
}

const OrderDetail: React.FC<ComponentProps> = ({ order_id, ...props }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { data, error, isLoading } = useOrderDetail(order_id);

  const MapRange = React.useMemo(
    () =>
      dynamic(() => import('@/components/map-range'), {
        loading: () => <MapLoader />,
        ssr: false,
      }),
    []
  );

  React.useEffect(() => {
    if (error) {
      toast({
        title: 'Failed to load order detail',
        description: error.message,
      });
      router.push('/');
    }
  }, [error, router]);

  if (isLoading) return <Loader />;
  if (error || !data) return <div>failed to load order data, retrying...</div>;

  return (
    <div className='grid items-start gap-8 lg:grid-cols-5'>
      <div className='flex flex-col gap-8 lg:col-span-3'>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl font-bold'>Order Detail</CardTitle>
            <CardDescription>All the details of your outlet.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className='grid gap-4'>
              <div className='flex flex-col space-y-4 text-sm'>
                <DetailList title='Order ID' data={data.data.order_id.toUpperCase()} />
                <DetailList title='Customer Name' data={data.data.Customer.User.fullname} />
                <DetailList title='Customer Email' data={data.data.Customer.User.email} />
                <DetailList title='Customer Address' data={data.data.CustomerAddress.address} />
                <DetailList title='Outlet Name' data={data.data.Outlet.name} />
                <DetailList title='Outlet Address' data={data.data.Outlet.address} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-xl font-bold'>Order Progress</CardTitle>
            <CardDescription>Manage the order progress.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='relative flex flex-col space-y-4'>
              {data.data.OrderProgress.map((item, idx) => (
                <div key={idx} className='flex items-center space-x-4 text-sm'>
                  <div
                    className={cn(
                      'flex items-center justify-center flex-none font-bold rounded-full size-8 aspect-square bg-muted',
                      idx === data.data.OrderProgress.length - 1 && 'text-white bg-primary'
                    )}>
                    {idx + 1}
                  </div>
                  <div className='flex items-center justify-between w-full'>
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
            <CardTitle className='text-xl font-bold'>Order Payment</CardTitle>
            <CardDescription>All the details of the order payment.</CardDescription>
          </CardHeader>
          <CardContent>
            {!data.data.Payment && (
              <div className='flex items-center justify-center w-full h-52'>
                <div className='flex flex-col items-center justify-center'>
                  <div className='text-center'>
                    <p className='font-medium'>Not yet paid</p>
                    <p className='text-sm text-muted-foreground'>Customer has not complete the order payment.</p>
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

      <div className='flex flex-col gap-8 lg:col-span-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl font-bold'>Order Location</CardTitle>
            <CardDescription>Order location details in a interactive map.</CardDescription>
          </CardHeader>
          <CardContent>
            <MapRange
              center={{
                latitude: data.data.CustomerAddress.latitude,
                longitude: data.data.CustomerAddress.longitude,
                name: data.data.CustomerAddress.name,
              }}
              points={[
                {
                  latitude: data.data.Outlet.latitude,
                  longitude: data.data.Outlet.longitude,
                  name: data.data.Outlet.name,
                },
              ]}
              className='w-full aspect-square lg:aspect-[4/3]'
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-xl font-bold'>Order Items</CardTitle>
            <CardDescription>All the details of customer's order items.</CardDescription>
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
            <CardTitle className='text-xl font-bold'>Order Fee</CardTitle>
            <CardDescription>All the details of customer's order fee.</CardDescription>
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
      </div>
    </div>
  );
};

export default OrderDetail;
