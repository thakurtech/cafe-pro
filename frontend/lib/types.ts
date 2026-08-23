export interface ModifierOption {
    id: string;
    name: string;
    price: number;
}

export interface ModifierGroup {
    id: string;
    name: string;
    minSelect: number;
    maxSelect: number;
    options: ModifierOption[];
}

export interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    popularityScore?: number;
    isAvailable?: boolean;
    isVeg?: boolean;
    taxRate?: number;
    margin?: number;
    modifiers?: ModifierGroup[];
}

export interface MenuCategory {
    id: string;
    name: string;
    items: MenuItem[];
}

export interface CartItem extends MenuItem {
    cartId: string;
    quantity: number;
    selectedModifiers: ModifierOption[];
    totalPrice: number;
}
