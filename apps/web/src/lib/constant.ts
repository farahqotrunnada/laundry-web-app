import {
  Car,
  ChartColumnBig,
  Home,
  MessageCircle,
  Shirt,
  ShoppingCart,
  Store,
  Ticket,
  Timer,
  User,
  Users,
  Zap,
} from 'lucide-react';

import { Location } from '@/types/location';
import { OrderStatus } from '@/types/order';
import { ProgressType } from '@/types/shared';
import { RequestAccessStatus } from '@/types/request-access';
import { SidebarMenu } from '@/types/navigation';

export const PROJECT_NAME = process.env.NEXT_PUBLIC_PROJECT_NAME as string;
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL as string;

export const SIDEBAR_LINKS: SidebarMenu[] = [
  {
    icon: Home,
    title: 'Dashboard',
    href: '/dashboard',
    active: '/dashboard',
    roles: ['Driver', 'SuperAdmin', 'OutletAdmin', 'WashingWorker', 'IroningWorker', 'PackingWorker'],
  },
  {
    icon: ChartColumnBig,
    title: 'Reports',
    href: '/dashboard/reports',
    active: '/dashboard/reports/**',
    roles: ['SuperAdmin', 'OutletAdmin'],
  },
  {
    icon: Users,
    title: 'Users',
    href: '/dashboard/users',
    active: '/dashboard/users/**',
    roles: ['SuperAdmin'],
  },
  {
    icon: Store,
    title: 'Outlets',
    href: '/dashboard/outlets',
    active: '/dashboard/outlets/**',
    roles: ['SuperAdmin'],
  },
  {
    icon: Timer,
    title: 'Shifts',
    href: '/dashboard/shifts',
    active: '/dashboard/shifts/**',
    roles: ['SuperAdmin'],
  },
  {
    icon: Shirt,
    title: 'Laundry Item',
    href: '/dashboard/laundry-items',
    active: '/dashboard/laundry-items/**',
    roles: ['SuperAdmin'],
  },
  {
    icon: ShoppingCart,
    title: 'Orders',
    href: '/dashboard/orders',
    active: '/dashboard/orders/**',
    roles: ['SuperAdmin', 'OutletAdmin'],
  },
  {
    icon: Car,
    title: 'Deliveries',
    href: '/dashboard/deliveries',
    active: '/dashboard/deliveries/**',
    roles: ['SuperAdmin', 'Driver'],
  },
  {
    icon: Zap,
    title: 'Jobs',
    href: '/dashboard/jobs',
    active: '/dashboard/jobs/**',
    roles: ['SuperAdmin', 'IroningWorker', 'PackingWorker', 'WashingWorker'],
  },
  {
    icon: Ticket,
    title: 'Request Access',
    href: '/dashboard/request-access',
    active: '/dashboard/request-access/**',
    roles: ['SuperAdmin', 'OutletAdmin', 'WashingWorker', 'IroningWorker', 'PackingWorker'],
  },
  {
    icon: MessageCircle,
    title: 'Complaints',
    href: '/dashboard/complaints',
    active: '/dashboard/complaints/**',
    roles: ['SuperAdmin', 'OutletAdmin'],
  },
];

export const FEATURES_LIST = [
  {
    title: 'Laundry Pickup Service',
    description:
      "We provide door-to-door laundry pickup and delivery without any minimum spend. Just schedule a pickup, and we'll handle the rest.",
    image: '/features/feature1.jpg',
  },
  {
    title: 'Express Wash & Fold',
    description:
      'Need your laundry done in a hurry? Our Express Wash & Fold service guarantees a 24-hour turnaround time.',
    image: '/features/feature2.jpg',
  },
  {
    title: 'Dry Cleaning Service',
    description:
      'Keep your delicate garments pristine with our premium dry cleaning service, expertly handling everything from suits to silk dresses with care and precision.',
    image: '/features/feature3.jpg',
  },
];

export const AVATAR_LINKS = [
  { title: 'Profile', href: '/profile', icon: User },
  { title: 'Orders', href: '/orders', icon: ShoppingCart },
];

export const OrderStatusMapper: Record<OrderStatus, string> = {
  WAITING_FOR_PICKUP: 'Menunggu Penjemputan Driver',
  ON_PROGRESS_PICKUP: 'Laundry Dikirim Ke Outlet',
  ARRIVED_AT_OUTLET: 'Laundry Telah Sampai Outlet',
  ON_PROGRESS_WASHING: 'Laundry Sedang Dicuci',
  ON_PROGRESS_IRONING: 'Laundry Sedang Disetrika',
  ON_PROGRESS_PACKING: 'Laundry Sedang Di Packing',
  WAITING_FOR_PAYMENT: 'Menunggu Pembayaran',
  ON_PROGRESS_DROPOFF: 'Laundry Dikirim Ke Customer',
  COMPLETED_ORDER: 'Laundry Telah Diterima Customer',
};

export const DEFAULT_LOCATION: Location = {
  latitude: -6.1741855,
  longitude: 106.8283465,
};

export const progressColor: Record<ProgressType, string> = {
  Pending: 'bg-muted text-muted-foreground hover:bg-muted/50',
  Ongoing: 'bg-amber-500 hover:bg-amber-600 text-white',
  Completed: 'bg-green-500 hover:bg-green-600 text-white',
};

export const statusColor: Record<RequestAccessStatus, string> = {
  Pending: 'bg-muted text-muted-foreground hover:bg-muted/50',
  Accepted: 'bg-green-500 hover:bg-green-600 text-white',
  Rejected: 'bg-red-500 hover:bg-red-600 text-white',
};

export const orderColor: Record<OrderStatus, string> = {
  WAITING_FOR_PICKUP: 'bg-blue-500 hover:bg-blue-600 text-white',
  ON_PROGRESS_PICKUP: 'bg-blue-500 hover:bg-blue-600 text-white',
  ARRIVED_AT_OUTLET: 'bg-violet-500 hover:bg-violet-600 text-white',
  ON_PROGRESS_WASHING: 'bg-violet-500 hover:bg-violet-600 text-white',
  ON_PROGRESS_IRONING: 'bg-violet-500 hover:bg-violet-600 text-white',
  ON_PROGRESS_PACKING: 'bg-violet-500 hover:bg-violet-600 text-white',
  WAITING_FOR_PAYMENT: 'bg-amber-500 hover:bg-amber-600 text-white',
  ON_PROGRESS_DROPOFF: 'bg-blue-500 hover:bg-blue-600 text-white',
  COMPLETED_ORDER: 'bg-green-500 hover:bg-green-600 text-white',
};
