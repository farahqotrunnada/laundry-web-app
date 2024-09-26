import {
  Award,
  Bell,
  Car,
  ChartColumnBig,
  Clock,
  CreditCard,
  DollarSign,
  HelpCircle,
  Loader,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Recycle,
  Shield,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Store,
  Ticket,
  Timer,
  Truck,
  User,
  UserCircle,
  UserPlus,
  Users,
  XCircle,
  Zap,
} from 'lucide-react';
import { NavigationItem, SidebarMenu } from '@/types/navigation';

import { Location } from '@/types/location';
import { OrderStatus } from '@/types/order';
import { ProgressType } from '@/types/shared';
import { RequestAccessStatus } from '@/types/request-access';

export const PROJECT_NAME = process.env.NEXT_PUBLIC_PROJECT_NAME as string;
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL as string;
export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL as string;
export const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_ID as string;

export const SIDEBAR_LINKS: SidebarMenu[] = [
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
  WAITING_FOR_DROPOFF: 'Menunggu Pengiriman Ke Customer',
  ON_PROGRESS_DROPOFF: 'Laundry Dikirim Ke Customer',
  COMPLETED_ORDER: 'Laundry Telah Sampai Customer',
  RECEIVED_ORDER: 'Laundry Diterima Customer',
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
  WAITING_FOR_DROPOFF: 'bg-blue-500 hover:bg-blue-600 text-white',
  ON_PROGRESS_DROPOFF: 'bg-blue-500 hover:bg-blue-600 text-white',
  COMPLETED_ORDER: 'bg-green-500 hover:bg-green-600 text-white',
  RECEIVED_ORDER: 'bg-green-500 hover:bg-green-600 text-white',
};

export const APPLICATION_MENU: NavigationItem[] = [
  {
    title: 'Help & Support',
    description: 'Clean Clothes with LaundryXpert',
    items: [
      {
        title: 'FAQ',
        href: '/faq',
        description: 'Frequently Asked Questions, Common Issues, and Solutions',
      },
      {
        title: 'Partnership',
        href: '/partnership',
        description: 'Explore opportunities to collaborate and grow with us through strategic partnerships.',
      },
    ],
  },
  {
    title: 'About',
    description: 'Clean Clothes with LaundryXpert',
    items: [
      {
        title: 'About us',
        href: '/about',
        description: 'Learn more about our mission and values.',
      },
      {
        title: 'Privacy Policy',
        href: '/privacy-policy',
        description: 'Understand our commitment to protecting your privacy.',
      },
      {
        title: 'Terms of Service',
        href: '/terms-of-service',
        description: 'Read our terms of service to understand our policies and guidelines.',
      },
    ],
  },
];

export const FAQS = [
  {
    question: 'How do I create an account?',
    answer:
      'To create an account, simply visit our website and fill out the registration form. You will receive a verification email with a link to activate your account, or you can use google authentication to link your account.',
    icon: UserPlus,
  },
  {
    question: 'Email confirmation has not arrived. What should I do?',
    answer:
      "If you haven't received an email confirmation, please check your spam folder, or contact our customer support team.",
    icon: Mail,
  },
  {
    question: 'How do I request a pickup?',
    answer:
      'Simply log in, select your items, and schedule a pickup time that works for you. You can also request a pickup from the dashboard.',
    icon: Truck,
  },
  {
    question: 'How do I track my laundry?',
    answer:
      "You can track your laundry's status in real-time from the moment it's picked up until it's delivered. You can also track your laundry from the dashboard.",
    icon: Loader,
  },
  {
    question: 'What is the pricing for pickup and delivery?',
    answer:
      'Pricing is calculated based on the distance between your location and the nearest outlet, and the weight of the laundry. You will see a detailed breakdown of costs before confirming your order.',
    icon: DollarSign,
  },
  {
    question: 'How long does the laundry process take?',
    answer:
      'Depending on your location and the laundry load, typical turnaround times are 24-48 hours. You can also track your laundry from the dashboard.',
    icon: Clock,
  },
  {
    question: "What happens if there's an issue with my laundry?",
    answer:
      "If you're unsatisfied with the service, you can file a complaint through our app, and our customer support team will assist you. You can also track your laundry from the dashboard.",
    icon: HelpCircle,
  },
];

export const POLICIES = [
  {
    title: 'Personal Information',
    content: 'We collect your name, email address, phone number, and delivery address.',
    icon: User,
  },
  {
    title: 'Location Data',
    content:
      'With your consent, we collect your location (longitude and latitude) to recommend the nearest outlet for optimal service.',
    icon: MapPin,
  },
  {
    title: 'Order Information',
    content: 'We collect details about your laundry requests, including items and order history.',
    icon: ShoppingBag,
  },
  {
    title: 'Data Usage',
    content: 'We use your information to process orders, improve app performance, and enhance user experience.',
    icon: Shield,
  },
  {
    title: 'Notifications',
    content: 'We send notifications regarding your orders and promotions.',
    icon: Bell,
  },
];

export const TERMS = [
  {
    title: 'Service Scope',
    content:
      'LaundryXpert provides laundry pickup, cleaning, and delivery services via its network of outlets. Delivery times may vary depending on the service chosen and location.',
    icon: Truck,
  },
  {
    title: 'User Accounts',
    content:
      'Users must register to place an order. You are responsible for maintaining the confidentiality of your account and password.',
    icon: UserCircle,
  },
  {
    title: 'Payment',
    content:
      'All payments for services must be made in full before delivery. Payment options include credit cards, debit cards, and online banking.',
    icon: CreditCard,
  },
  {
    title: 'Order Process',
    content:
      'Once a pickup request is made, the nearest outlet will handle your laundry. You will receive notifications at each stage of the process, including pickup, cleaning, and delivery.',
    icon: Package,
  },
  {
    title: 'Cancellation',
    content:
      'Cancellations must be made before the laundry is processed. Refunds will be subject to a review of the request.',
    icon: XCircle,
  },
];

export const ABOUT_FEATURE = [
  {
    icon: Truck,
    title: 'Convenient Pickup & Delivery',
    description: 'We collect and return your laundry right at your doorstep, saving you time and effort.',
  },
  {
    icon: Clock,
    title: 'Real-Time Tracking',
    description: "Track your laundry's journey from pickup to delivery with our advanced tracking system.",
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Multiple secure payment options ensure your transactions are safe and hassle-free.',
  },
  {
    icon: Smartphone,
    title: 'User-Friendly Platform',
    description: 'Our intuitive app and website make managing your laundry needs a breeze.',
  },
  {
    icon: Recycle,
    title: 'Eco-Friendly Practices',
    description:
      'We use environmentally friendly detergents and energy-efficient machines to reduce our carbon footprint.',
  },
  {
    icon: Award,
    title: 'Quality Guarantee',
    description: 'We stand behind our service with a 100% satisfaction guarantee on all our work.',
  },
];
