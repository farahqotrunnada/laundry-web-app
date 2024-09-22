import { DeliveryType, OrderStatus, PaymentMethod, PaymentStatus, ProgressType } from '@prisma/client';
import { MIDTRANS_PASSWORD, MIDTRANS_SERVER_KEY, MIDTRANS_URL } from '@/config';
import axios, { isAxiosError } from 'axios';

import ApiError from '@/utils/error.util';
import { MidtransStatus } from '@/type/midtrans';
import { Socket } from '@/libs/socketio';
import crypto from 'crypto';
import prisma from '@/libs/prisma';

export default class PaymentAction {
  private socket: Socket;

  constructor() {
    this.socket = Socket.getInstance();
  }

  create = async (user_id: string, order_id: string, method: PaymentMethod, receipt_url: string | undefined) => {
    try {
      const order = await prisma.order.findUnique({
        where: {
          order_id,
          Customer: {
            User: {
              user_id,
            },
          },
        },
        include: {
          OrderProgress: true,
          OrderItem: true,
          Customer: {
            include: {
              User: {
                select: {
                  email: true,
                  fullname: true,
                },
              },
            },
          },
          Payment: true,
        },
      });

      if (!order) throw new ApiError(404, 'Order not found, or not belong to this user');
      if (!order.is_payable) throw new ApiError(400, 'Order cannot be paid, please check your order progress');
      if (order.Payment) throw new ApiError(400, 'Theres already a payment for this order');

      let payment;

      if (method === 'Manual') {
        const updated = await prisma.order.update({
          where: { order_id },
          data: {
            is_payable: false,
            Payment: {
              create: {
                method,
                receipt_url,
                status: 'Paid',
              },
            },
          },
          include: {
            Payment: true,
          },
        });

        payment = updated.Payment;
      } else {
        const { data } = await axios.post(
          MIDTRANS_URL,
          {
            transaction_details: {
              order_id,
              gross_amount: Number(order.delivery_fee) + Number(order.laundry_fee),
              item_details: order.OrderItem.map((item) => ({
                id: item.order_item_id,
                quantity: item.quantity,
              })),
              customer_details: {
                first_name: order.Customer.User.fullname,
                email: order.Customer.User.email,
              },
            },
          },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'Basic ' + Buffer.from(MIDTRANS_SERVER_KEY + ':' + MIDTRANS_PASSWORD).toString('base64'),
            },
          }
        );

        const updated = await prisma.order.update({
          where: { order_id },
          data: {
            is_payable: true,
            Payment: {
              create: {
                method,
                payment_url: data.redirect_url,
                status: PaymentStatus.Pending,
              },
            },
          },
          include: {
            Payment: true,
          },
        });

        payment = updated.Payment;
      }

      if (
        order.OrderProgress &&
        order.OrderProgress.find((progress) => progress.status === OrderStatus.WAITING_FOR_PAYMENT)
      ) {
        await prisma.order.update({
          where: { order_id },
          data: {
            OrderProgress: {
              create: {
                status: OrderStatus.ON_PROGRESS_DROPOFF,
              },
            },
            Delivery: {
              create: {
                outlet_id: order.outlet_id,
                progress: ProgressType.Pending,
                type: DeliveryType.Dropoff,
              },
            },
          },
        });
      }

      this.socket.emitTo(order.outlet_id, ['OutletAdmin'], 'notification', {
        title: 'Order Paid',
        description: 'A new order has been paid, check your dashboard to see the details',
      });

      return payment;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new ApiError(
          (error.response && error.response.status) || 500,
          (error.response && error.response.data) || 'Something went wrong'
        );
      }

      throw error;
    }
  };

  callback = async (
    order_id: string,
    signature_key: string,
    status_code: string,
    gross_amount: string,
    transaction_status: MidtransStatus
  ) => {
    try {
      if (transaction_status !== 'settlement') return; // ignore other status

      const order = await prisma.order.findUnique({
        where: {
          order_id,
        },
      });

      if (!order) throw new ApiError(404, 'Order not found');
      if (!order.is_payable) throw new ApiError(400, 'Order is already paid');

      const total = Number(order.delivery_fee) + Number(order.laundry_fee);
      if (total !== Number(gross_amount)) throw new ApiError(400, 'Gross amount is invalid');

      const calculated_signature = crypto
        .createHash('sha512')
        .update(order_id + status_code + gross_amount + MIDTRANS_SERVER_KEY)
        .digest('hex');

      if (calculated_signature !== signature_key) throw new ApiError(400, 'Signature is invalid');

      await prisma.order.update({
        where: { order_id },
        data: {
          is_payable: false,
          Payment: {
            update: {
              status: PaymentStatus.Paid,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  };
}
