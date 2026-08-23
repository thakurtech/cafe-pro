'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';

export interface CartModifier {
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  modifiers?: CartModifier[];
  notes?: string;
}

export interface ShopData {
  name: string;
  themeColor: string;
  logo?: string;
  tagline?: string;
  currencySymbol?: string;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
  tableId?: string;
  tableNumber?: string;
  slug: string;
  shopData: ShopData | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_TABLE'; payload: { tableId: string; tableNumber?: string } }
  | { type: 'INIT_SHOP'; payload: { slug: string; shopData: ShopData; items?: CartItem[] } };

const initialState: CartState = {
  items: [],
  subtotal: 0,
  totalItems: 0,
  slug: '',
  shopData: null,
};

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
  return { totalItems, subtotal };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.menuItemId === action.payload.menuItemId &&
          JSON.stringify(item.modifiers || []) === JSON.stringify(action.payload.modifiers || []) &&
          (item.notes || '') === (action.payload.notes || '')
      );

      let newItems: CartItem[];
      if (existingItemIndex > -1) {
        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + action.payload.quantity,
        };
      } else {
        newItems = [...state.items, action.payload];
      }
      return { ...state, items: newItems, ...calculateTotals(newItems) };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      return { ...state, items: newItems, ...calculateTotals(newItems) };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const newItems = state.items.filter((item) => item.id !== action.payload.id);
        return { ...state, items: newItems, ...calculateTotals(newItems) };
      }
      const newItems = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
      );
      return { ...state, items: newItems, ...calculateTotals(newItems) };
    }

    case 'CLEAR_CART':
      return { ...state, items: [], subtotal: 0, totalItems: 0 };

    case 'SET_TABLE':
      return { ...state, tableId: action.payload.tableId, tableNumber: action.payload.tableNumber };

    case 'INIT_SHOP': {
      // If already initialized for the same slug and has items in memory, keep items
      const itemsToUse = action.payload.items !== undefined ? action.payload.items : state.items;
      return {
        ...state,
        slug: action.payload.slug,
        shopData: action.payload.shopData,
        items: itemsToUse,
        ...calculateTotals(itemsToUse),
      };
    }

    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setTable: (tableId: string, tableNumber?: string) => void;
  initShop: (slug: string, shopData: ShopData) => void;
} | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const isLoaded = useRef(false);

  // Sync state.items to localStorage when slug and items change
  useEffect(() => {
    if (typeof window !== 'undefined' && state.slug && isLoaded.current) {
      try {
        localStorage.setItem(`cart_${state.slug}`, JSON.stringify(state.items));
      } catch (e) {
        console.error('Failed to save cart to localStorage', e);
      }
    }
  }, [state.items, state.slug]);

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    if (typeof window !== 'undefined' && state.slug) {
      localStorage.removeItem(`cart_${state.slug}`);
    }
  }, [state.slug]);

  const setTable = useCallback((tableId: string, tableNumber?: string) => {
    dispatch({ type: 'SET_TABLE', payload: { tableId, tableNumber } });
  }, []);

  const initShop = useCallback((slug: string, shopData: ShopData) => {
    let initialItems: CartItem[] = [];
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`cart_${slug}`);
        if (saved) {
          initialItems = JSON.parse(saved);
        }
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
    isLoaded.current = true;
    dispatch({ type: 'INIT_SHOP', payload: { slug, shopData, items: initialItems } });
  }, []);

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart, setTable, initShop }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
