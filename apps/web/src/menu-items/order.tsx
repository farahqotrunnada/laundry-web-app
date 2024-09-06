// assets
import { Box } from 'iconsax-react';

// types
import { NavItemType } from 'types/menu';

// icons
const icons = {
  order: Box
};

// ==============================|| MENU ITEMS - ORDER ||============================== //

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
      breadcrumbs: false,
      children: [
        {
          type: 'item',
          id: 'list-orders',
          title: 'List All Orders',
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
