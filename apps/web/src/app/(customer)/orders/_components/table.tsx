'use client';

import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Order, OrderProgress } from '@/types/order';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, relativeTime } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Complaint } from '@/types/complaint';
import CreateComplaintModal from './create-modal';
import Link from 'next/link';
import Loader from '@/components/loader/loader';
import { MoreHorizontal } from 'lucide-react';
import { OrderStatusMapper, orderColor } from '@/lib/constant';
import { Outlet } from '@/types/outlet';
import { useCustomerOrders } from '@/hooks/use-customer-orders';

interface CustomerOrderTableProps {
  type: 'All' | 'Ongoing' | 'Paid' | 'Completed';
}

const CustomerOrderTable: React.FC<CustomerOrderTableProps> = ({ type, ...props }) => {
  const { data, error, isLoading } = useCustomerOrders(type);

  if (isLoading) return <Loader />;
  if (error || !data) return <div>failed to load orders data, retrying...</div>;

  return (
    <div className='border rounded-md'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Delivery Fee</TableHead>
            <TableHead>Laundry Fee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className='h-20 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
          {data.data.map((order, idx) => {
            const latest = order.OrderProgress.at(0);

            return (
              <TableRow key={idx}>
                <TableCell>
                  <Badge variant='secondary'>{formatCurrency(order.delivery_fee)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant='secondary'>{formatCurrency(order.laundry_fee)}</Badge>
                </TableCell>
                <TableCell>
                  {latest && <Badge className={orderColor[latest.status]}>{OrderStatusMapper[latest.status]}</Badge>}
                </TableCell>
                <TableCell>
                  <span className='whitespace-nowrap text-muted-foreground'>{relativeTime(order.created_at)}</span>
                </TableCell>
                <TableCell>
                  <TableAction order={order} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

interface TableActionProps {
  order: Order & {
    Outlet?: Outlet;
    Complaint?: Complaint;
    OrderProgress?: OrderProgress[];
  };
}

const TableAction: React.FC<TableActionProps> = ({ order }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='relative w-8 h-8 p-0'>
          {order.is_payable && (
            <>
              <div className='absolute top-0 right-0 -m-0.5 rounded-full bg-primary size-2 animate-ping' />
              <div className='absolute top-0 right-0 -m-0.5 rounded-full bg-primary size-2' />
            </>
          )}
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={'/orders/' + order.order_id} className='w-full'>
          <DropdownMenuItem>View Order</DropdownMenuItem>
        </Link>
        {order.is_payable && (
          <Link href={'/orders/' + order.order_id + '/payment'} className='w-full'>
            <DropdownMenuItem className='text-primary'>Process Payment</DropdownMenuItem>
          </Link>
        )}
        {order.is_completed && !order.Complaint && <CreateComplaintModal order_id={order.order_id} />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomerOrderTable;
