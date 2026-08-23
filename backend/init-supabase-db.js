const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function initDb() {
    console.log('🚀 Initializing Supabase PostgreSQL schema for CafeOS...\n');

    const client = new Client({
        host: 'aws-0-ap-southeast-1.pooler.supabase.com',
        port: 6543,
        database: 'postgres',
        user: 'postgres.hzdnkgbhywemamboohaj',
        password: 'CafeOS2026secure',
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ Connected to Supabase PostgreSQL!');

        const statements = [
            // Drop existing types if any, or create if not exists
            `DO $$ BEGIN
                CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'CAFE_OWNER', 'MANAGER', 'CASHIER', 'CHEF', 'CAPTAIN', 'AFFILIATE', 'CUSTOMER');
            EXCEPTION WHEN duplicate_object THEN null;
            END $$;`,

            `DO $$ BEGIN
                CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED', 'HELD');
            EXCEPTION WHEN duplicate_object THEN null;
            END $$;`,

            `DO $$ BEGIN
                CREATE TYPE "OrderSource" AS ENUM ('POS', 'QR_TABLE', 'QR_PICKUP', 'DELIVERY', 'MINI_APP', 'STOREFRONT');
            EXCEPTION WHEN duplicate_object THEN null;
            END $$;`,

            `DO $$ BEGIN
                CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'UPI', 'CARD', 'SPLIT', 'RAZORPAY', 'PAY_AT_COUNTER');
            EXCEPTION WHEN duplicate_object THEN null;
            END $$;`,

            `DO $$ BEGIN
                CREATE TYPE "TableStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'CLEANING', 'RESERVED');
            EXCEPTION WHEN duplicate_object THEN null;
            END $$;`,

            `DO $$ BEGIN
                CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'GRACE', 'SUSPENDED', 'CANCELLED');
            EXCEPTION WHEN duplicate_object THEN null;
            END $$;`,

            // Shop
            `CREATE TABLE IF NOT EXISTS "Shop" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "name" TEXT NOT NULL,
                "slug" TEXT NOT NULL UNIQUE,
                "address" TEXT,
                "phone" TEXT,
                "email" TEXT,
                "currency" TEXT NOT NULL DEFAULT 'INR',
                "themeColor" TEXT NOT NULL DEFAULT '#6366F1',
                "logo" TEXT,
                "tagline" TEXT,
                "upiId" TEXT,
                "gstNumber" TEXT,
                "fssaiNumber" TEXT,
                "isActive" BOOLEAN NOT NULL DEFAULT true,
                "trialEndsAt" TIMESTAMP(3),
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`,

            // Subscription
            `CREATE TABLE IF NOT EXISTS "Subscription" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "shopId" TEXT NOT NULL UNIQUE REFERENCES "Shop"("id") ON DELETE CASCADE,
                "plan" TEXT NOT NULL DEFAULT 'STARTER',
                "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',
                "trialEndsAt" TIMESTAMP(3),
                "currentPeriodEnd" TIMESTAMP(3),
                "razorpaySubId" TEXT,
                "priceMonthly" INTEGER NOT NULL DEFAULT 499,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`,

            // User
            `CREATE TABLE IF NOT EXISTS "User" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "phone" TEXT NOT NULL UNIQUE,
                "name" TEXT,
                "email" TEXT UNIQUE,
                "password" TEXT NOT NULL DEFAULT '$2b$10$EpRnTzVlqHNP0.fUbXUwSOal5wAllaRpTp.1x3/EnsPawL.9v.que',
                "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
                "shopId" TEXT REFERENCES "Shop"("id") ON DELETE SET NULL,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`,

            // Table
            `CREATE TABLE IF NOT EXISTS "Table" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "shopId" TEXT NOT NULL REFERENCES "Shop"("id") ON DELETE CASCADE,
                "name" TEXT NOT NULL,
                "capacity" INTEGER NOT NULL DEFAULT 4,
                "status" "TableStatus" NOT NULL DEFAULT 'AVAILABLE',
                "qrCode" TEXT,
                "position" JSONB,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`,

            // MenuCategory
            `CREATE TABLE IF NOT EXISTS "MenuCategory" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "name" TEXT NOT NULL,
                "shopId" TEXT NOT NULL REFERENCES "Shop"("id") ON DELETE CASCADE,
                "sortOrder" INTEGER NOT NULL DEFAULT 0,
                "isActive" BOOLEAN NOT NULL DEFAULT true
            );`,

            // MenuItem
            `CREATE TABLE IF NOT EXISTS "MenuItem" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "name" TEXT NOT NULL,
                "description" TEXT,
                "price" DOUBLE PRECISION NOT NULL,
                "image" TEXT,
                "isAvailable" BOOLEAN NOT NULL DEFAULT true,
                "categoryId" TEXT NOT NULL REFERENCES "MenuCategory"("id") ON DELETE CASCADE,
                "popularityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
                "margin" DOUBLE PRECISION NOT NULL DEFAULT 0,
                "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
                "isVeg" BOOLEAN NOT NULL DEFAULT true
            );`,

            // ModifierGroup
            `CREATE TABLE IF NOT EXISTS "ModifierGroup" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "name" TEXT NOT NULL,
                "minSelect" INTEGER NOT NULL DEFAULT 0,
                "maxSelect" INTEGER NOT NULL DEFAULT 1,
                "menuItemId" TEXT NOT NULL REFERENCES "MenuItem"("id") ON DELETE CASCADE
            );`,

            // ModifierOption
            `CREATE TABLE IF NOT EXISTS "ModifierOption" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "name" TEXT NOT NULL,
                "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
                "modifierGroupId" TEXT NOT NULL REFERENCES "ModifierGroup"("id") ON DELETE CASCADE
            );`,

            // Order
            `CREATE TABLE IF NOT EXISTS "Order" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "shortId" TEXT NOT NULL,
                "shopId" TEXT NOT NULL REFERENCES "Shop"("id") ON DELETE CASCADE,
                "customerId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
                "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
                "source" "OrderSource" NOT NULL DEFAULT 'POS',
                "totalAmount" DOUBLE PRECISION NOT NULL,
                "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
                "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
                "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
                "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH',
                "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
                "paidAt" TIMESTAMP(3),
                "discountCode" TEXT,
                "tableNumber" TEXT,
                "tableId" TEXT,
                "notes" TEXT,
                "cashierId" TEXT,
                "razorpayOrderId" TEXT,
                "razorpayPaymentId" TEXT,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`,

            // OrderItem
            `CREATE TABLE IF NOT EXISTS "OrderItem" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "orderId" TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
                "menuItemId" TEXT NOT NULL REFERENCES "MenuItem"("id") ON DELETE CASCADE,
                "quantity" INTEGER NOT NULL,
                "price" DOUBLE PRECISION NOT NULL,
                "nameSnapshot" TEXT NOT NULL DEFAULT '',
                "priceSnapshot" DOUBLE PRECISION NOT NULL DEFAULT 0,
                "taxRateSnapshot" DOUBLE PRECISION NOT NULL DEFAULT 0
            );`,

            // OrderItemModifiers join table
            `CREATE TABLE IF NOT EXISTS "_OrderItemModifiers" (
                "A" TEXT NOT NULL REFERENCES "ModifierOption"("id") ON DELETE CASCADE,
                "B" TEXT NOT NULL REFERENCES "OrderItem"("id") ON DELETE CASCADE,
                PRIMARY KEY ("A", "B")
            );`,

            // Refund
            `CREATE TABLE IF NOT EXISTS "Refund" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "orderId" TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
                "amount" DOUBLE PRECISION NOT NULL,
                "reason" TEXT NOT NULL,
                "refundedBy" TEXT NOT NULL,
                "type" TEXT NOT NULL DEFAULT 'FULL',
                "status" TEXT NOT NULL DEFAULT 'COMPLETED',
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`,

            // LoyaltyProfile
            `CREATE TABLE IF NOT EXISTS "LoyaltyProfile" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
                "shopId" TEXT NOT NULL DEFAULT '',
                "points" INTEGER NOT NULL DEFAULT 0,
                "totalVisits" INTEGER NOT NULL DEFAULT 0,
                "lastVisit" TIMESTAMP(3),
                "streakCount" INTEGER NOT NULL DEFAULT 0,
                "tier" TEXT NOT NULL DEFAULT 'Bronze'
            );`,

            // LoyaltyTransaction
            `CREATE TABLE IF NOT EXISTS "LoyaltyTransaction" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "profileId" TEXT NOT NULL REFERENCES "LoyaltyProfile"("id") ON DELETE CASCADE,
                "points" INTEGER NOT NULL,
                "reason" TEXT NOT NULL,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`,

            // Reward
            `CREATE TABLE IF NOT EXISTS "Reward" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "profileId" TEXT NOT NULL REFERENCES "LoyaltyProfile"("id") ON DELETE CASCADE,
                "name" TEXT NOT NULL,
                "description" TEXT,
                "isRedeemed" BOOLEAN NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`,

            // ReferralCode
            `CREATE TABLE IF NOT EXISTS "ReferralCode" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "code" TEXT NOT NULL UNIQUE,
                "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
                "usageCount" INTEGER NOT NULL DEFAULT 0,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`,

            // Campaign
            `CREATE TABLE IF NOT EXISTS "Campaign" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "shopId" TEXT NOT NULL REFERENCES "Shop"("id") ON DELETE CASCADE,
                "name" TEXT NOT NULL,
                "type" TEXT NOT NULL,
                "status" TEXT NOT NULL,
                "content" TEXT,
                "imageUrl" TEXT,
                "metrics" JSONB,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`,

            // Attribution
            `CREATE TABLE IF NOT EXISTS "Attribution" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "orderId" TEXT NOT NULL UNIQUE REFERENCES "Order"("id") ON DELETE CASCADE,
                "source" TEXT NOT NULL,
                "campaignId" TEXT,
                "influencerId" TEXT,
                "affiliateId" TEXT,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`,

            // AffiliateAccount
            `CREATE TABLE IF NOT EXISTS "AffiliateAccount" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
                "code" TEXT NOT NULL UNIQUE,
                "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
                "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 150
            );`,

            // AffiliateReferral
            `CREATE TABLE IF NOT EXISTS "AffiliateReferral" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "affiliateId" TEXT NOT NULL REFERENCES "AffiliateAccount"("id") ON DELETE CASCADE,
                "shopId" TEXT NOT NULL UNIQUE REFERENCES "Shop"("id") ON DELETE CASCADE,
                "status" TEXT NOT NULL,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`,

            // AffiliatePayout
            `CREATE TABLE IF NOT EXISTS "AffiliatePayout" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "affiliateId" TEXT NOT NULL REFERENCES "AffiliateAccount"("id") ON DELETE CASCADE,
                "amount" DOUBLE PRECISION NOT NULL,
                "status" TEXT NOT NULL,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`,

            // InventoryItem
            `CREATE TABLE IF NOT EXISTS "InventoryItem" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "shopId" TEXT NOT NULL REFERENCES "Shop"("id") ON DELETE CASCADE,
                "name" TEXT NOT NULL,
                "quantity" DOUBLE PRECISION NOT NULL,
                "unit" TEXT NOT NULL,
                "lowStockThreshold" DOUBLE PRECISION NOT NULL DEFAULT 5,
                "expiryDate" TIMESTAMP(3),
                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`,

            // Session
            `CREATE TABLE IF NOT EXISTS "Session" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "userId" TEXT REFERENCES "User"("id") ON DELETE CASCADE,
                "token" TEXT NOT NULL UNIQUE,
                "source" TEXT,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`,

            // AiLog
            `CREATE TABLE IF NOT EXISTS "AiLog" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "feature" TEXT NOT NULL,
                "input" TEXT,
                "output" TEXT,
                "tokens" INTEGER,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`,

            // Shift
            `CREATE TABLE IF NOT EXISTS "Shift" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "shopId" TEXT NOT NULL REFERENCES "Shop"("id") ON DELETE CASCADE,
                "userId" TEXT NOT NULL,
                "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "endTime" TIMESTAMP(3),
                "openingCash" DOUBLE PRECISION NOT NULL DEFAULT 0,
                "closingCash" DOUBLE PRECISION,
                "expectedCash" DOUBLE PRECISION,
                "notes" TEXT,
                "status" TEXT NOT NULL DEFAULT 'ACTIVE'
            );`,

            // Discount
            `CREATE TABLE IF NOT EXISTS "Discount" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "shopId" TEXT NOT NULL REFERENCES "Shop"("id") ON DELETE CASCADE,
                "code" TEXT NOT NULL,
                "type" TEXT NOT NULL,
                "value" DOUBLE PRECISION NOT NULL,
                "minOrder" DOUBLE PRECISION NOT NULL DEFAULT 0,
                "maxDiscount" DOUBLE PRECISION,
                "usageLimit" INTEGER,
                "usageCount" INTEGER NOT NULL DEFAULT 0,
                "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "validUntil" TIMESTAMP(3),
                "isActive" BOOLEAN NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "Discount_shopId_code_key" UNIQUE ("shopId", "code")
            );`,

            // AuditLog
            `CREATE TABLE IF NOT EXISTS "AuditLog" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "shopId" TEXT,
                "userId" TEXT,
                "action" TEXT NOT NULL,
                "entity" TEXT NOT NULL,
                "entityId" TEXT,
                "oldValue" TEXT,
                "newValue" TEXT,
                "ipAddress" TEXT,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`,

            // Game
            `CREATE TABLE IF NOT EXISTS "Game" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "shopId" TEXT NOT NULL REFERENCES "Shop"("id") ON DELETE CASCADE,
                "name" TEXT NOT NULL,
                "type" TEXT NOT NULL DEFAULT 'SCRATCH_CARD',
                "isActive" BOOLEAN NOT NULL DEFAULT true,
                "attemptsPerDay" INTEGER NOT NULL DEFAULT 1,
                "winRate" DOUBLE PRECISION NOT NULL DEFAULT 0.3,
                "rewardType" TEXT NOT NULL DEFAULT 'POINTS',
                "rewardValue" DOUBLE PRECISION NOT NULL DEFAULT 50,
                "minOrderAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`,

            // GameSession
            `CREATE TABLE IF NOT EXISTS "GameSession" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "gameId" TEXT NOT NULL REFERENCES "Game"("id") ON DELETE CASCADE,
                "customerId" TEXT,
                "deviceId" TEXT,
                "won" BOOLEAN NOT NULL DEFAULT false,
                "rewardType" TEXT,
                "rewardValue" DOUBLE PRECISION,
                "rewardClaimed" BOOLEAN NOT NULL DEFAULT false,
                "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`
        ];

        for (let i = 0; i < statements.length; i++) {
            process.stdout.write(`Executing DDL statement ${i + 1}/${statements.length}... `);
            await client.query(statements[i]);
            console.log('✓');
        }

        console.log('\n🌱 Seeding initial records...');

        // 1. Super Admin
        const adminPass = await bcrypt.hash('password', 10);
        await client.query(`
            INSERT INTO "User" ("id", "phone", "name", "email", "password", "role")
            VALUES ('admin-001', 'admin', 'Super Admin (CafeOS)', 'admin@cafeos.com', $1, 'SUPER_ADMIN')
            ON CONFLICT ("phone") DO UPDATE SET "password" = $1, "email" = 'admin@cafeos.com';
        `, [adminPass]);
        console.log('✓ Super Admin created (admin@cafeos.com / password)');

        // 2. Demo Shop: Cafe Noir
        const trialDate = new Date();
        trialDate.setDate(trialDate.getDate() + 14);

        await client.query(`
            INSERT INTO "Shop" ("id", "name", "slug", "address", "phone", "email", "themeColor", "currency", "upiId", "trialEndsAt")
            VALUES ('shop-noir-001', 'Café Noir', 'cafe-noir', '12 Indiranagar 100ft Road, Bengaluru', '+91 98765 43210', 'owner@cafenoir.com', '#6366F1', 'INR', 'cafenoir@okaxis', $1)
            ON CONFLICT ("slug") DO UPDATE SET "name" = 'Café Noir', "themeColor" = '#6366F1';
        `, [trialDate]);
        console.log('✓ Shop "Café Noir" created');

        // 3. Shop Subscription
        await client.query(`
            INSERT INTO "Subscription" ("id", "shopId", "plan", "status", "trialEndsAt", "priceMonthly")
            VALUES ('sub-noir-001', 'shop-noir-001', 'STARTER', 'TRIAL', $1, 499)
            ON CONFLICT ("shopId") DO NOTHING;
        `, [trialDate]);
        console.log('✓ Subscription created for Café Noir (TRIAL, ₹499/mo)');

        // 4. Shop Owner
        const ownerPass = await bcrypt.hash('password', 10);
        await client.query(`
            INSERT INTO "User" ("id", "phone", "name", "email", "password", "role", "shopId")
            VALUES ('user-owner-001', '+919876543210', 'Arjun Mehta (Owner)', 'owner@cafenoir.com', $1, 'CAFE_OWNER', 'shop-noir-001')
            ON CONFLICT ("phone") DO UPDATE SET "password" = $1, "email" = 'owner@cafenoir.com';
        `, [ownerPass]);
        console.log('✓ Cafe Owner created (owner@cafenoir.com / password)');

        // 5. Tables
        for (let t = 1; t <= 8; t++) {
            await client.query(`
                INSERT INTO "Table" ("id", "shopId", "name", "capacity", "status")
                VALUES ($1, 'shop-noir-001', $2, 4, 'AVAILABLE')
                ON CONFLICT ("id") DO NOTHING;
            `, [`tbl-${t}`, `Table ${t}`]);
        }
        console.log('✓ 8 Tables created for Café Noir');

        // 6. Categories & Menu Items
        await client.query(`
            INSERT INTO "MenuCategory" ("id", "name", "shopId", "sortOrder")
            VALUES ('cat-coffee', 'Coffee & Espresso', 'shop-noir-001', 1),
                   ('cat-tea', 'Artisanal Teas', 'shop-noir-001', 2),
                   ('cat-bakery', 'Bakery & Pastries', 'shop-noir-001', 3),
                   ('cat-food', 'Savory & Bites', 'shop-noir-001', 4)
            ON CONFLICT ("id") DO NOTHING;
        `);

        await client.query(`
            INSERT INTO "MenuItem" ("id", "name", "description", "price", "categoryId", "popularityScore", "taxRate", "isVeg")
            VALUES 
                ('item-espresso', 'Double Espresso', 'Rich concentrated extraction from fresh roasted Arabica beans', 140, 'cat-coffee', 95, 0.05, true),
                ('item-cappuccino', 'Classic Cappuccino', 'Equal parts espresso, steamed milk, and silky velvety foam', 190, 'cat-coffee', 99, 0.05, true),
                ('item-latte', 'Vanilla Bean Latte', 'Espresso layered with whole steamed milk and organic Madagascar vanilla', 220, 'cat-coffee', 90, 0.05, true),
                ('item-croissant', 'Butter Croissant', 'Flaky, butter-laminated classic French morning pastry', 130, 'cat-bakery', 85, 0.05, true),
                ('item-brownie', 'Fudge Brownie', 'Warm decadent dark chocolate brownie with walnuts', 160, 'cat-bakery', 88, 0.05, true),
                ('item-panini', 'Pesto Mozzarella Panini', 'Grilled artisan sourdough with basil pesto, fresh buffalo mozzarella, and sundried tomato', 260, 'cat-food', 92, 0.05, true)
            ON CONFLICT ("id") DO NOTHING;
        `);
        console.log('✓ Menu Categories & Items seeded');

        // 7. Modifiers
        await client.query(`
            INSERT INTO "ModifierGroup" ("id", "name", "minSelect", "maxSelect", "menuItemId")
            VALUES ('mg-milk', 'Choice of Milk', 0, 1, 'item-cappuccino')
            ON CONFLICT ("id") DO NOTHING;
        `);
        await client.query(`
            INSERT INTO "ModifierOption" ("id", "name", "price", "modifierGroupId")
            VALUES 
                ('opt-oat', 'Oat Milk', 40, 'mg-milk'),
                ('opt-almond', 'Almond Milk', 45, 'mg-milk'),
                ('opt-extra-shot', 'Extra Espresso Shot', 50, 'mg-milk')
            ON CONFLICT ("id") DO NOTHING;
        `);
        console.log('✓ Modifiers seeded');

        // 8. Scratch Card Game
        await client.query(`
            INSERT INTO "Game" ("id", "shopId", "name", "type", "isActive", "attemptsPerDay", "winRate", "rewardType", "rewardValue")
            VALUES ('game-noir-001', 'shop-noir-001', 'Daily Lucky Scratch', 'SCRATCH_CARD', true, 1, 0.4, 'POINTS', 50)
            ON CONFLICT ("id") DO NOTHING;
        `);
        console.log('✓ Scratch card game seeded');

        console.log('\n🎉 Supabase Database setup complete & fully ready!');
    } catch (err) {
        console.error('❌ Error during setup:', err);
    } finally {
        await client.end();
    }
}

initDb();
