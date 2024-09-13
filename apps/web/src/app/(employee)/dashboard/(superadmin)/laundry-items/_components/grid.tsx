'use client';

import * as React from 'react';

import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { Plus, Shirt } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Loader from '@/components/loader/loader';
import { useDebounceValue } from 'usehooks-ts';
import { useLaundryItems } from '@/hooks/use-laundry-items';

interface LaundryItemGridProps {
  //
}

const LaundryItemGrid: React.FC<LaundryItemGridProps> = ({ ...props }) => {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    {
      id: 'name',
      value: '',
    },
  ]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filter] = useDebounceValue<ColumnFiltersState>(columnFilters, 500);
  const { data, error, isLoading } = useLaundryItems(filter, pagination, sorting);

  React.useEffect(() => {
    if (search.has('page')) {
      const page = Number(search.get('page'));
      setPagination((p) => ({ ...p, pageIndex: page }));
    }

    if (search.has('limit')) {
      const limit = Number(search.get('limit'));
      setPagination((p) => ({ ...p, pageSize: limit }));
    }

    if (search.has('id') && search.has('value')) {
      const id = search.get('id') as string;
      const value = search.get('value') as string;
      setColumnFilters((f) => [...f, { id, value }]);
    }

    if (search.has('key') && search.has('desc')) {
      const key = search.get('key') as string;
      const desc = search.get('desc') as string;
      setSorting((s) => [...s, { id: key, desc: desc === 'true' }]);
    }
  }, [search, setPagination]);

  React.useEffect(() => {
    const params = new URLSearchParams();

    params.set('page', pagination.pageIndex.toString());
    params.set('limit', pagination.pageSize.toString());

    if (filter.length > 0) {
      const item = filter[0];
      params.set('id', item.id);
      params.set('value', item.value as string);
    }

    if (sorting.length > 0) {
      const item = sorting[0];
      params.set('key', item.id);
      params.set('desc', item.desc.toString());
    }

    const out = params.toString();

    router.push(`${pathname}?${out}`);
  }, [router, pathname, pagination, sorting, filter]);

  if (isLoading) return <Loader />;
  if (error || !data) return <div>failed to load laundry items data, retrying...</div>;

  return (
    <div className='w-full'>
      <div className='flex flex-col mb-6 space-y-4 lg:justify-between lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4'>
        <Input
          autoFocus
          placeholder='Filter name'
          value={columnFilters.find((item) => item.id === 'name')?.value as string}
          onChange={(event) => setColumnFilters([{ id: 'name', value: event.target.value }])}
          className='w-full lg:max-w-md'
        />

        <div className='flex flex-col items-center w-full space-x-2 space-y-4 lg:w-auto lg:flex-row lg:space-y-0 lg:space-x-4'>
          <Link href='/dashboard/laundry-items/create' className='w-full'>
            <Button className='w-full'>
              <Plus className='inline-block w-4 h-4 mr-2' />
              <span>Add Laundry Items</span>
            </Button>
          </Link>
        </div>
      </div>

      {data.data.items.length === 0 && <div>No laundry items found.</div>}

      <div className='grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6'>
        {data.data.items.map((item) => (
          <div
            key={item.laundry_item_id}
            className='relative border rounded-lg group hover:border-primary hover:cursor-pointer'>
            <div className='flex items-end p-6 aspect-square'>
              <h3 className='text-lg font-medium group-hover:text-primary'>{item.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LaundryItemGrid;
