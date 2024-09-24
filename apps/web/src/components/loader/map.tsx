import * as React from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
}

export const MapLoader: React.FC<LoaderProps> = ({ className }) => {
  return <Skeleton className={cn('w-full rounded-lg aspect-video', className)} />;
};
