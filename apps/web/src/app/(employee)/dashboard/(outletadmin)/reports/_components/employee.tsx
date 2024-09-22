'use client';

import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ReportData } from './report';

const chartConfig = {
  roles: {
    label: 'Roles',
  },
  OutletAdmin: {
    label: 'Outlet Admin',
    color: 'hsl(var(--chart-1))',
  },
  WashingWorker: {
    label: 'Washing Worker',
    color: 'hsl(var(--chart-2))',
  },
  IroningWorker: {
    label: 'Ironing Worker',
    color: 'hsl(var(--chart-3))',
  },
  PackingWorker: {
    label: 'Packing Worker',
    color: 'hsl(var(--chart-4))',
  },
  Driver: {
    label: 'Driver',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

interface EmployeeChartProps {
  data?: ReportData;
}

const EmployeeChart: React.FC<EmployeeChartProps> = ({ data }) => {
  const formatted = React.useMemo(() => {
    if (!data) return [];

    return data.users
      .filter((user) => Object.keys(chartConfig).includes(user.role))
      .map((user) => {
        return {
          role: user.role,
          Employees: user.user_count,
          fill: 'var(--color-' + user.role + ')',
        };
      });
  }, [data]);

  const total = (data && data.users.reduce((acc, curr) => acc + Number(curr.user_count), 0)) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-bold'>Employee Distribution</CardTitle>
        <CardDescription>Distribution of employees by role</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={formatted}
            layout='vertical'
            margin={{
              left: 0,
            }}>
            <YAxis
              dataKey='role'
              type='category'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
            />
            <XAxis dataKey='Employees' type='number' hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey='Employees' layout='vertical' radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          There are <span className='text-primary'>{total}</span> employees in total.
        </div>
        <div className='leading-none text-muted-foreground'>Showing total employees by role</div>
      </CardFooter>
    </Card>
  );
};

export default EmployeeChart;
