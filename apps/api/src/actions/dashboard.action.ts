import { Prisma, Role } from '@prisma/client';

import moment from 'moment';
import prisma from '@/libs/prisma';

export class DashboardAction {
  enumerate = (start: Date, end: Date) => {
    const dates = [];

    const pointer = moment(start);
    const last = moment(end);

    while (pointer.isSameOrBefore(last)) {
      dates.push(pointer.clone().toDate());
      pointer.add(1, 'days');
    }

    return dates;
  };

  index = async (user_id: string, role: string, outlet_id: string | undefined = 'All') => {
    try {
      const start = moment().subtract(3, 'months').toDate();
      const end = moment().toDate();

      let orders: Array<{
        created_at: string;
        laundry_fee: number;
        delivery_fee: number;
        order_count: number;
      }> = [];

      let users: Array<{
        role: Role;
        user_count: number;
      }> = [];

      let selected_id = outlet_id;

      if (role !== 'SuperAdmin') {
        const outlet = await prisma.outlet.findFirst({
          where: {
            Employee: {
              some: {
                user_id,
              },
            },
          },
        });

        if (!outlet) throw new Error('No outlet found, please contact the administrator');
        selected_id = outlet.outlet_id;
      }

      if (outlet_id === 'All') {
        orders = await prisma.$queryRaw(
          Prisma.sql`
            SELECT
              DATE_TRUNC('day', created_at) AS created_at,
              SUM(laundry_fee) AS laundry_fee,
              SUM(delivery_fee) AS delivery_fee,
              COUNT(order_id) AS order_count
            FROM orders
            WHERE created_at BETWEEN ${start} AND ${end}
            GROUP BY DATE_TRUNC('day', created_at)
          `
        );

        users = await prisma.$queryRaw(
          Prisma.sql`
            SELECT
              role,
              COUNT(user_id) AS user_count
            FROM users
            GROUP BY role
          `
        );
      } else {
        orders = await prisma.$queryRaw(
          Prisma.sql`
            SELECT
              DATE_TRUNC('day', created_at) AS created_at,
              SUM(laundry_fee) AS laundry_fee,
              SUM(delivery_fee) AS delivery_fee,
              COUNT(order_id) AS order_count
            FROM orders
            WHERE outlet_id = ${outlet_id} AND created_at BETWEEN ${start} AND ${end}
            GROUP BY DATE_TRUNC('day', created_at)
          `
        );

        users = await prisma.$queryRaw(
          Prisma.sql`
            SELECT
              role,
              COUNT(users.user_id) AS user_count
            FROM users join employees on users.user_id = employees.user_id
            WHERE employees.outlet_id = ${outlet_id}
            GROUP BY role
          `
        );
      }

      const enumerated = this.enumerate(start, end);

      return {
        users,
        orders: enumerated.map((date) => {
          const order = orders.find((order) => moment(order.created_at).isSame(date, 'day'));
          if (order) return order;

          return {
            created_at: date,
            laundry_fee: 0,
            delivery_fee: 0,
            order_count: 0,
          };
        }),
      };
    } catch (error) {
      throw error;
    }
  };
}
