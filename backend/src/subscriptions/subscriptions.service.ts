import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getOrCreate(shopId: string) {
    let subscription = await this.prisma.subscription.findUnique({
      where: { shopId },
    });

    if (!subscription) {
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14);

      subscription = await this.prisma.subscription.create({
        data: {
          shopId,
          plan: 'STARTER',
          status: 'TRIAL',
          trialEndsAt,
          priceMonthly: 499,
        },
      });
    }

    return subscription;
  }

  async getStatus(shopId: string) {
    const subscription = await this.getOrCreate(shopId);

    const now = new Date();
    let isAccessAllowed = false;

    switch (subscription.status) {
      case 'TRIAL':
        isAccessAllowed = subscription.trialEndsAt ? subscription.trialEndsAt > now : false;
        break;
      case 'ACTIVE':
        isAccessAllowed = true;
        break;
      case 'GRACE':
        isAccessAllowed = true; // grace period - still allowed
        break;
      case 'PAST_DUE':
      case 'SUSPENDED':
      case 'CANCELLED':
        isAccessAllowed = false;
        break;
    }

    const daysRemaining = subscription.trialEndsAt
      ? Math.max(0, Math.ceil((subscription.trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : null;

    return {
      ...subscription,
      isAccessAllowed,
      daysRemaining,
    };
  }

  async activate(shopId: string, razorpaySubId?: string) {
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

    return this.prisma.subscription.update({
      where: { shopId },
      data: {
        status: 'ACTIVE',
        currentPeriodEnd,
        razorpaySubId,
      },
    });
  }

  async suspend(shopId: string) {
    return this.prisma.subscription.update({
      where: { shopId },
      data: { status: 'SUSPENDED' },
    });
  }

  async extendTrial(shopId: string, days: number) {
    const subscription = await this.getOrCreate(shopId);
    const newTrialEnd = new Date(subscription.trialEndsAt || new Date());
    newTrialEnd.setDate(newTrialEnd.getDate() + days);

    return this.prisma.subscription.update({
      where: { shopId },
      data: {
        trialEndsAt: newTrialEnd,
        status: 'TRIAL',
      },
    });
  }

  async getAllSubscriptions() {
    return this.prisma.subscription.findMany({
      include: { shop: { select: { name: true, slug: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
