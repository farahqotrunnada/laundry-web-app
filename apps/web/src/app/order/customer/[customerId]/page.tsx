'use client';

// project-imports
import { useParams } from 'next/navigation';
import OrderDetailsPage from 'views/order/OrderDetails';

export default function PickupRequest() {
  const { customerId } = useParams<{ customerId: string }>();

  return <OrderDetailsPage customerId={customerId} />;
}
