import { Module } from '@nestjs/common';
import { StorefrontService } from './storefront.service';
import { StorefrontController } from './storefront.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [StorefrontService, PrismaService],
  controllers: [StorefrontController],
  exports: [StorefrontService],
})
export class StorefrontModule {}
