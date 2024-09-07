'use client';

import UserOrderTable from 'views/users/orders/UserOrderTable';
import useUser from 'hooks/useUser';

export default function PickupRequest() {
  const user = useUser();
  if (!user || !user.user_id) return null;

  return <UserOrderTable user_id={user.user_id} />;
}
