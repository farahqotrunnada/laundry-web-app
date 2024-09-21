'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ReportData } from './report';

const chartConfig = {
  views: {
    label: 'Revenue',
  },
  laundry_fee: {
    label: 'Laundry Fee',
    color: 'hsl(var(--chart-1))',
  },
  delivery_fee: {
    label: 'Delivery Fee',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

interface DailyChartProps {
  data?: ReportData;
}

const DailyChart: React.FC<DailyChartProps> = ({ data }) => {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>('laundry_fee');

  const total = React.useMemo(() => {
    if (!data) {
      return {
        laundry_fee: 0,
        delivery_fee: 0,
      };
    }

    return {
      laundry_fee: data.orders.reduce((acc, curr) => acc + Number(curr.laundry_fee), 0),
      delivery_fee: data.orders.reduce((acc, curr) => acc + Number(curr.delivery_fee), 0),
    };
  }, [data]);

  const formatted = React.useMemo(() => {
    if (!data) return [];

    return data.orders.map((order) => {
      return {
        date: new Date(order.created_at).toLocaleDateString(),
        laundry_fee: Number(order.laundry_fee),
        delivery_fee: Number(order.delivery_fee),
      };
    });
  }, [data]);

  return (
    <Card>
      <CardHeader className='flex flex-col items-stretch p-0 space-y-0 border-b sm:flex-row'>
        <div className='flex flex-col justify-center flex-1 gap-1 px-6 py-5 sm:py-6'>
          <CardTitle className='font-bold'>Order Summary</CardTitle>
          <CardDescription>Showing total orders for the last 6 months</CardDescription>
        </div>
        <div className='flex'>
          {['laundry_fee', 'delivery_fee'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className='relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6'
                onClick={() => setActiveChart(chart)}>
                <span className='text-xs text-muted-foreground'>{chartConfig[chart].label}</span>
                <span className='text-lg font-bold leading-none sm:text-3xl'>
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className='px-2 sm:p-6'>
        <ChartContainer config={chartConfig} className='aspect-auto h-[250px] w-full'>
          <BarChart
            accessibilityLayer
            data={formatted}
            margin={{
              left: 12,
              right: 12,
            }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  nameKey='views'
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DailyChart;
