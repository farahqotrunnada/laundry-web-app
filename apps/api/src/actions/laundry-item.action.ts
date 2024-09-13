import ApiError from '@/utils/error.util';
import { LaundryItem } from '@prisma/client';
import prisma from '@/libs/prisma';

export default class LaundryItemAction {
  index = async (
    page: number,
    limit: number,
    id: string | undefined,
    value: string | undefined,
    key: string | undefined,
    desc: string | undefined
  ) => {
    try {
      let filter;
      let order;

      if (id && value) {
        filter = {
          [id as keyof LaundryItem]: { contains: value as string, mode: 'insensitive' },
        };
      }

      if (key && value) {
        order = {
          [key as keyof LaundryItem]: desc === 'true' ? 'desc' : 'asc',
        };
      }

      const query = {
        where: filter,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: order,
      };

      const [items, count] = await prisma.$transaction([
        prisma.laundryItem.findMany(query),
        prisma.laundryItem.count(query),
      ]);

      return [items, count];
    } catch (error) {
      throw error;
    }
  };

  show = async (laundry_item_id: string) => {
    try {
      const item = await prisma.laundryItem.findUnique({
        where: { laundry_item_id },
      });

      if (!item) throw new ApiError(404, 'Laundry Item not found');

      return item;
    } catch (error) {
      throw error;
    }
  };

  create = async (name: string, icon_url: string | undefined) => {
    try {
      const item = await prisma.laundryItem.create({
        data: {
          name,
          icon_url: icon_url!,
        },
      });

      return item;
    } catch (error) {
      throw error;
    }
  };

  update = async (laundry_item_id: string, name: string, icon_url: string | undefined) => {
    try {
      const item = await prisma.laundryItem.update({
        where: { laundry_item_id },
        data: { name, icon_url },
      });

      return item;
    } catch (error) {
      throw error;
    }
  };

  destroy = async (laundry_item_id: string) => {
    try {
      const item = await prisma.laundryItem.delete({
        where: { laundry_item_id },
      });

      return item;
    } catch (error) {
      throw error;
    }
  };
}
