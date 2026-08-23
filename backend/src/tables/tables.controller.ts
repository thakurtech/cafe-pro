import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { TablesService } from './tables.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TableStatus } from '@prisma/client';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('shopId') shopId: string) {
    return this.tablesService.findAll(shopId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() data: { shopId: string; name: string; capacity?: number; position?: any; qrCode?: string }) {
    return this.tablesService.create(data.shopId, data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() data: { shopId: string; name?: string; capacity?: number; status?: TableStatus; position?: any; qrCode?: string }
  ) {
    return this.tablesService.update(id, data.shopId, data);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() data: { shopId: string; status: TableStatus }
  ) {
    return this.tablesService.updateStatus(id, data.shopId, data.status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Query('shopId') shopId: string) {
    return this.tablesService.remove(id, shopId);
  }

  @Post('bulk-create')
  @UseGuards(JwtAuthGuard)
  bulkCreate(@Body() data: { shopId: string; count: number }) {
    return this.tablesService.bulkCreate(data.shopId, data.count);
  }
}
