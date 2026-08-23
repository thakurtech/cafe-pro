import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StorefrontService {
  constructor(private prisma: PrismaService) {}

  async getShopBySlug(slug: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        themeColor: true,
        logo: true,
        tagline: true,
        phone: true,
        address: true,
        upiId: true,
        subscription: {
          select: { status: true, trialEndsAt: true }
        }
      },
    });

    if (!shop) throw new NotFoundException('Shop not found');
    return shop;
  }

  async getMenuBySlug(slug: string) {
    const shop = await this.prisma.shop.findUnique({ where: { slug } });
    if (!shop) throw new NotFoundException('Shop not found');

    return this.prisma.menuCategory.findMany({
      where: { shopId: shop.id, isActive: true },
      include: {
        items: {
          where: { isAvailable: true },
          include: {
            modifiers: {
              include: { options: true }
            }
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });
  }

  async createGuestOrder(slug: string, orderData: any) {
    const shop = await this.prisma.shop.findUnique({ where: { slug } });
    if (!shop) throw new NotFoundException('Shop not found');

    let customerId: string | undefined = undefined;
    const phone = orderData.customerPhone || orderData.customerDetails?.phone;
    const notes = orderData.notes || orderData.customerDetails?.notes;

    if (phone) {
      let user = await this.prisma.user.findUnique({ where: { phone } });
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            phone,
            role: 'CUSTOMER',
            shopId: shop.id
          }
        });
      }
      customerId = user.id;
    }

    // Basic calculation for total Amount (can be more advanced with modifiers)
    let totalAmount = 0;
    const orderItemsData: {
      menuItemId: string;
      quantity: number;
      price: number;
      nameSnapshot: string;
      priceSnapshot: number;
      taxRateSnapshot: number;
    }[] = [];
    
    for (const item of orderData.items) {
      const menuItem = await this.prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
      if (menuItem) {
        totalAmount += menuItem.price * item.quantity;
        orderItemsData.push({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: menuItem.price,
          nameSnapshot: menuItem.name,
          priceSnapshot: menuItem.price,
          taxRateSnapshot: menuItem.taxRate,
        });
      }
    }

    // Apply discount
    let discountAmount = 0;
    if (orderData.discountCode) {
      const discount = await this.prisma.discount.findFirst({
        where: { shopId: shop.id, code: orderData.discountCode, isActive: true }
      });
      if (discount) {
        if (discount.type === 'PERCENTAGE') {
          discountAmount = (totalAmount * discount.value) / 100;
          if (discount.maxDiscount) discountAmount = Math.min(discountAmount, discount.maxDiscount);
        } else {
          discountAmount = discount.value;
        }
        await this.prisma.discount.update({ where: { id: discount.id }, data: { usageCount: { increment: 1 } }});
      }
    }

    const finalAmount = Math.max(0, totalAmount - discountAmount);

    return this.prisma.order.create({
      data: {
        shopId: shop.id,
        customerId,
        source: 'STOREFRONT',
        status: 'PENDING',
        totalAmount: finalAmount,
        subtotal: totalAmount,
        discountAmount,
        discountCode: orderData.discountCode,
        paymentMethod: orderData.paymentMethod || 'CASH',
        tableId: orderData.tableId,
        tableNumber: orderData.tableNumber,
        notes: notes || orderData.notes,
        shortId: `#${Math.floor(1000 + Math.random() * 9000)}`,
        items: {
          create: orderItemsData
        }
      }
    });
  }

  async getOrderStatus(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { menuItem: true } } }
    });
  }

  async validateDiscount(shopId: string, code: string, orderTotal: number) {
    const discount = await this.prisma.discount.findFirst({
      where: { shopId, code, isActive: true }
    });
    if (!discount) return { valid: false, reason: 'Invalid or expired code' };
    if (discount.minOrder && orderTotal < discount.minOrder) return { valid: false, reason: `Minimum order amount is ${discount.minOrder}` };
    
    return { valid: true, discount };
  }

  getRazorpayKey() {
    return { keyId: process.env.RAZORPAY_KEY_ID };
  }
}
