import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { StorefrontService } from './storefront.service';

@Controller('storefront')
export class StorefrontController {
  constructor(private readonly storefrontService: StorefrontService) {}

  @Get('razorpay-key')
  getRazorpayKey() {
    return this.storefrontService.getRazorpayKey();
  }

  @Get('orders/:orderId')
  getOrderStatus(@Param('orderId') orderId: string) {
    return this.storefrontService.getOrderStatus(orderId);
  }

  @Get(':slug')
  getShopInfo(@Param('slug') slug: string) {
    return this.storefrontService.getShopBySlug(slug);
  }

  @Get(':slug/menu')
  getMenu(@Param('slug') slug: string) {
    return this.storefrontService.getMenuBySlug(slug);
  }

  @Post(':slug/orders')
  createGuestOrder(@Param('slug') slug: string, @Body() orderData: any) {
    return this.storefrontService.createGuestOrder(slug, orderData);
  }

  @Post(':slug/validate-discount')
  validateDiscount(@Param('slug') slug: string, @Body() data: { shopId: string; code: string; orderTotal: number }) {
    return this.storefrontService.validateDiscount(data.shopId, data.code, data.orderTotal);
  }
}
