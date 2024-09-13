'use client';

import * as React from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { useCustomerAddresses } from '@/hooks/use-customer-addresses';

interface AddressListProps {
  //
}

const CustomerAddressTable: React.FC<AddressListProps> = ({ ...props }) => {
  const { data, error, isLoading } = useCustomerAddresses();

  if (isLoading) return <Skeleton className='w-full h-32 rounded-lg' />;
  if (error || !data) return <div>failed to load</div>;

  return (
    <div className='border rounded-md'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead className='hidden sm:table-cell'>City</TableHead>
            <TableHead className='hidden md:table-cell'>Region</TableHead>
            <TableHead className='hidden md:table-cell'>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((address, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <div className='flex items-center gap-2 font-medium'>
                  {address.address}
                  {address.is_primary && (
                    <Badge className='text-xs' variant='secondary'>
                      Primary
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className='hidden sm:table-cell'>{address.city}</TableCell>
              <TableCell className='hidden md:table-cell'>{address.region}</TableCell>
              <TableCell className='hidden md:table-cell'>{formatDate(address.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerAddressTable;
