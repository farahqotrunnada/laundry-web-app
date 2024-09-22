'use client';

import * as React from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ReportData } from './report';

const chartConfig = {
  order_count: {
    label: 'Order',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

interface OrderChartProps {
  data?: ReportData;
}

export const OrderChart: React.FC<OrderChartProps> = ({ data }) => {
  const formatted = React.useMemo(() => {
    if (!data) return [];

    return data.orders.slice(-7).map((order) => {
      return {
        date: new Date(order.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        order_count: Number(order.order_count),
      };
    });
  }, [data]);

  const total = (data && data.orders.reduce((acc, curr) => acc + Number(curr.order_count), 0)) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-bold'>Order Distribution</CardTitle>
        <CardDescription>Distribution of orders by day</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={formatted}
            margin={{
              left: 12,
              right: 12,
            }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='date' tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line dataKey='order_count' type='step' stroke='var(--color-order_count)' strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          There are <span className='text-primary'>{total}</span> orders in total.
        </div>
        <div className='leading-none text-muted-foreground'>Showing number of orders for the last 7 days</div>
      </CardFooter>
    </Card>
  );
};
