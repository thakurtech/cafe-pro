import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Razorpay = require('razorpay');
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private razorpay: any;

  constructor(private prisma: PrismaService) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });
  }

  async createRazorpayOrder(amount: number, currency: string, receipt: string, notes?: Record<string, string>) {
    try {
      const options = {
        amount: Math.round(amount * 100), // amount in paise (smallest unit)
        currency,
        receipt,
        notes,
      };
      const order = await this.razorpay.orders.create(options);
      return { id: order.id, amount: order.amount, currency: order.currency };
    } catch (error) {
      throw new BadRequestException('Failed to create Razorpay order: ' + (error as Error).message);
    }
  }

  verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, signature: string): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new BadRequestException('Razorpay secret not configured');

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');

    return generated_signature === signature;
  }

  async updateOrderPayment(
    internalOrderId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
  ) {
    return this.prisma.order.update({
      where: { id: internalOrderId },
      data: {
        paymentStatus: 'PAID',
        paidAt: new Date(),
        razorpayOrderId,
        razorpayPaymentId,
      },
    });
  }
}
