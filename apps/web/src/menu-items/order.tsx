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
  id: 'transaction',
  title: 'Transaction',
  type: 'group',
  children: [
    {
      id: 'order',
      title: 'Order',
      type: 'collapse',
      icon: icons.order,
      breadcrumbs: false,
      children: [
        {
          id: 'order-list',
          title: 'List Orders',
          type: 'item',
          url: '/customers/1/orders',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default order;
