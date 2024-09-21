'use client';

import * as React from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import DailyChart from './daily';
import EmployeeChart from './employee';
import Loader from '@/components/loader/loader';
import { OrderChart } from './order';
import { Outlet } from '@/types/outlet';
import { fetcher } from '@/lib/axios';
import { useAuth } from '@/hooks/use-auth';
import useSWR from 'swr';

interface ReportProps {
  //
}

export interface ReportData {
  orders: Array<{
    created_at: string;
    laundry_fee: number;
    delivery_fee: number;
    order_count: number;
  }>;
  users: Array<{
    role: string;
    user_count: number;
  }>;
}

const Report: React.FC<ReportProps> = ({ ...props }) => {
  const [selected, setSelected] = React.useState<string>('All');
  const { user } = useAuth();

  const { data: outlets } = useSWR<{
    message: string;
    data: Outlet[];
  }>('/outlets/list', fetcher);

  const {
    data: report,
    error,
    isLoading,
  } = useSWR<{
    message: string;
    data: ReportData;
  }>(
    [
      '/dashboard/data',
      {
        params: {
          outlet_id: selected,
        },
      },
    ],
    fetcher
  );

  React.useEffect(() => {
    const original = console.error;
    console.error = (...args: any[]) => {
      if (typeof args[0] === 'string' && /defaultProps/.test(args[0])) return;
      original(...args);
    };
    return () => {
      console.error = original;
    };
  }, []);

  if (isLoading) return <Loader />;
  if (error || !report) return <div>failed to load orders data, retrying...</div>;

  return (
    <>
      {user && user.role === 'SuperAdmin' && outlets && (
        <Select onValueChange={(value) => setSelected(value)}>
          <SelectTrigger>
            <SelectValue placeholder='Select outlet' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='All'>All</SelectItem>
            {outlets.data.map((outlet) => (
              <SelectItem key={outlet.outlet_id} value={outlet.outlet_id}>
                {outlet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <DailyChart data={report.data} />

      <div className='grid gap-8 lg:grid-cols-2'>
        <EmployeeChart data={report.data} />
        <OrderChart data={report.data} />
      </div>
    </>
  );
};

export default Report;
