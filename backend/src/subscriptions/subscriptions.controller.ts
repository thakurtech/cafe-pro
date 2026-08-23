import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get(':shopId')
  @UseGuards(JwtAuthGuard)
  getStatus(@Param('shopId') shopId: string) {
    return this.subscriptionsService.getStatus(shopId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll() {
    return this.subscriptionsService.getAllSubscriptions();
  }

  @Post(':shopId/activate')
  @UseGuards(JwtAuthGuard)
  activate(@Param('shopId') shopId: string, @Body() body: { razorpaySubId?: string }) {
    return this.subscriptionsService.activate(shopId, body.razorpaySubId);
  }

  @Post(':shopId/extend-trial')
  @UseGuards(JwtAuthGuard)
  extendTrial(@Param('shopId') shopId: string, @Body() body: { days: number }) {
    return this.subscriptionsService.extendTrial(shopId, body.days || 7);
  }

  @Post(':shopId/suspend')
  @UseGuards(JwtAuthGuard)
  suspend(@Param('shopId') shopId: string) {
    return this.subscriptionsService.suspend(shopId);
  }
}
