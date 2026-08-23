import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ShopsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.shop.findMany({
            include: {
                _count: {
                    select: { orders: true, users: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findBySlug(slug: string) {
        const shop = await this.prisma.shop.findUnique({
            where: { slug },
            include: {
                menuCategories: {
                    include: {
                        items: true,
                    },
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });

        if (!shop) {
            throw new NotFoundException(`Shop with slug "${slug}" not found`);
        }

        return shop;
    }

    async findById(id: string) {
        const shop = await this.prisma.shop.findUnique({
            where: { id },
        });

        if (!shop) {
            throw new NotFoundException(`Shop with id "${id}" not found`);
        }

        return shop;
    }

    async create(data: {
        name: string;
        slug: string;
        address?: string;
        phone?: string;
        email?: string;
        upiId?: string;
        gstNumber?: string;
        logo?: string;
        themeColor?: string;
        ownerId: string;
    }) {
        const { ownerId, ...shopData } = data;

        // Create shop
        const shop = await this.prisma.shop.create({
            data: {
                ...shopData,
                slug: shopData.slug.toLowerCase().replace(/\s+/g, '-'),
            },
        });

        // Update owner's shopId
        await this.prisma.user.update({
            where: { id: ownerId },
            data: { shopId: shop.id },
        });

        return shop;
    }

    // Create shop with new owner (for super admin cafe creation wizard)
    async createWithOwner(data: {
        // Shop data
        name: string;
        slug: string;
        address?: string;
        phone?: string;
        email?: string;
        upiId?: string;
        themeColor?: string;
        // Owner data
        ownerName: string;
        ownerEmail: string;
        ownerPhone: string;
        ownerPassword?: string;
    }) {
        const bcrypt = require('bcrypt');
        const defaultPassword = data.ownerPassword || 'password';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Create shop first
        const shop = await this.prisma.shop.create({
            data: {
                name: data.name,
                slug: data.slug.toLowerCase().replace(/\s+/g, '-'),
                address: data.address,
                phone: data.phone,
                email: data.email,
                upiId: data.upiId,
                themeColor: data.themeColor,
            },
        });

        // Create owner user linked to shop
        const owner = await this.prisma.user.create({
            data: {
                phone: data.ownerPhone,
                email: data.ownerEmail,
                name: data.ownerName,
                password: hashedPassword,
                role: 'CAFE_OWNER',
                shopId: shop.id,
            },
        });

        return { shop, owner };
    }


    async update(id: string, data: Partial<{
        name: string;
        address: string;
        phone: string;
        email: string;
        upiId: string;
        gstNumber: string;
        fssaiNumber: string;
        logo: string;
        tagline: string;
        themeColor: string;
        isActive: boolean;
    }>) {
        return this.prisma.shop.update({
            where: { id },
            data,
        });
    }

    async getStats(shopId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(startOfWeek.getDate() - today.getDay());

        const [
            todayOrders,
            todayRevenue,
            yesterdayOrders,
            yesterdayRevenue,
            weekOrders,
            weekRevenue,
            totalCustomers,
            inventory,
            lastOrder
        ] = await Promise.all([
            this.prisma.order.count({ where: { shopId, createdAt: { gte: today } } }),
            this.prisma.order.aggregate({ where: { shopId, createdAt: { gte: today }, status: { not: 'CANCELLED' } }, _sum: { totalAmount: true } }),
            this.prisma.order.count({ where: { shopId, createdAt: { gte: yesterday, lt: today } } }),
            this.prisma.order.aggregate({ where: { shopId, createdAt: { gte: yesterday, lt: today }, status: { not: 'CANCELLED' } }, _sum: { totalAmount: true } }),
            this.prisma.order.count({ where: { shopId, createdAt: { gte: startOfWeek } } }),
            this.prisma.order.aggregate({ where: { shopId, createdAt: { gte: startOfWeek }, status: { not: 'CANCELLED' } }, _sum: { totalAmount: true } }),
            this.prisma.order.groupBy({ by: ['customerId'], where: { shopId, customerId: { not: null } } }),
            this.prisma.inventoryItem.findMany({ where: { shopId } }),
            this.prisma.order.findFirst({ where: { shopId }, orderBy: { createdAt: 'desc' } })
        ]);

        const alerts: string[] = [];
        const lowInventory = inventory.filter(item => item.quantity <= item.lowStockThreshold);
        if (lowInventory.length > 0) {
            alerts.push(`Low inventory for ${lowInventory.length} items`);
        }
        
        if (lastOrder) {
            const hoursSinceLastOrder = (new Date().getTime() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60);
            if (hoursSinceLastOrder >= 2) {
                alerts.push('No orders in last 2 hours');
            }
        } else {
            alerts.push('No orders found');
        }

        const avgOrderValue = todayOrders > 0 ? (todayRevenue._sum.totalAmount || 0) / todayOrders : 0;
        const totalCustomersCount = totalCustomers.length;

        // Simplify topItems and recentOrders for this endpoint
        const topItems = await this.prisma.orderItem.groupBy({
            by: ['menuItemId'],
            where: { order: { shopId, createdAt: { gte: today } } },
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 5
        });

        const recentOrders = await this.prisma.order.findMany({
            where: { shopId },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        return {
            todayRevenue: todayRevenue._sum.totalAmount || 0,
            todayOrders,
            yesterdayRevenue: yesterdayRevenue._sum.totalAmount || 0,
            yesterdayOrders,
            weekRevenue: weekRevenue._sum.totalAmount || 0,
            weekOrders,
            totalCustomers: totalCustomersCount,
            avgOrderValue,
            repeatCustomerRate: 0, // calculate appropriately if needed
            topItems: topItems,
            recentOrders: recentOrders,
            alerts,
            revenueByHour: [], // mock or implement appropriately
            revenueByDay: [] // mock or implement appropriately
        };
    }
}
