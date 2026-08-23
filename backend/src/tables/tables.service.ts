import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TableStatus } from '@prisma/client';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  async findAll(shopId: string) {
    return this.prisma.table.findMany({
      where: { shopId },
      orderBy: { name: 'asc' },
    });
  }

  async create(shopId: string, data: { name: string; capacity?: number; position?: any; qrCode?: string }) {
    return this.prisma.table.create({
      data: {
        shopId,
        ...data,
      },
    });
  }

  async update(id: string, shopId: string, data: { name?: string; capacity?: number; status?: TableStatus; position?: any; qrCode?: string }) {
    return this.prisma.table.update({
      where: { id, shopId },
      data,
    });
  }

  async updateStatus(id: string, shopId: string, status: TableStatus) {
    return this.prisma.table.update({
      where: { id, shopId },
      data: { status },
    });
  }

  async remove(id: string, shopId: string) {
    return this.prisma.table.delete({
      where: { id, shopId },
    });
  }

  async bulkCreate(shopId: string, count: number) {
    const existingTablesCount = await this.prisma.table.count({ where: { shopId } });
    
    const newTables = Array.from({ length: count }).map((_, i) => ({
      shopId,
      name: `Table ${existingTablesCount + i + 1}`,
      capacity: 4,
    }));

    return this.prisma.table.createMany({
      data: newTables,
    });
  }
}
