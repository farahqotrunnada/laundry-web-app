import { Car } from 'iconsax-react';
import { NavItemType } from 'types/menu';

const icons = {
  delivery: Car
};

const order: NavItemType = {
  type: 'group',
  id: 'driver',
  title: 'Driver',
  children: [
    {
      type: 'collapse',
      id: 'deliveries',
      title: 'Manage Deliveries',
      icon: icons.delivery,
      children: [
        {
          type: 'item',
          id: 'all-deliveries',
          title: 'All Deliveries',
          url: '/dashboard/deliveries'
        },
        {
          type: 'item',
          id: 'ongoing-deliveries',
          title: 'Ongoing Deliveries',
          url: '/dashboard/deliveries/ongoing'
        }
      ]
    }
  ]
};

export default order;
