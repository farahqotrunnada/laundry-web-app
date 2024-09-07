import { Box } from 'iconsax-react';
import { NavItemType } from 'types/menu';

const icons = {
  order: Box
};

const order: NavItemType = {
  type: 'group',
  id: 'transaction',
  title: 'Transaction',
  children: [
    {
      type: 'collapse',
      id: 'orders',
      title: 'Manage Orders',
      icon: icons.order,

      children: [
        {
          type: 'item',
          id: 'list-orders',
          title: 'All Orders',
          url: '/dashboard/orders'
        },
        {
          type: 'item',
          id: 'create-order',
          title: 'Create New Order',
          url: '/dashboard/orders/create'
        }
      ]
    }
  ]
};

export default order;
