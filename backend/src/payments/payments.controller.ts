import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  createOrder(@Body() data: { orderId: string; amount: number; currency?: string }) {
    return this.paymentsService.createRazorpayOrder(data.amount, data.currency || 'INR', data.orderId);
  }

  @Post('verify')
  async verifyPayment(@Body() data: { orderId: string; razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) {
    const isValid = this.paymentsService.verifyPayment(data.razorpayOrderId, data.razorpayPaymentId, data.razorpaySignature);
    if (!isValid) {
      throw new BadRequestException('Invalid payment signature');
    }
    return this.paymentsService.updateOrderPayment(data.orderId, data.razorpayOrderId, data.razorpayPaymentId);
  }
}
