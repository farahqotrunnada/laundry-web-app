import { NavItemType } from 'types/menu';
import delivery from './delivery';
import order from './order';

const menuItems: { items: NavItemType[] } = {
  items: [order, delivery]
};

export default menuItems;
