// contexts/CartContext.tsx

import React, { createContext, useContext, useReducer } from 'react';
import { Database } from '../types/database'; 
import { devLog } from '../lib/devLogger';

// Derivamos el tipo Product para que siempre coincida con el esquema
type Product = Database['public']['Tables']['products']['Row'];

// Creamos un tipo CartItem que es un Product + la propiedad quantity
interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

// Actualizamos las acciones para que usen los tipos correctos
type CartAction =
  | { type: 'ADD_ITEM'; payload: Product } // 👈 CAMBIO: El payload es un objeto Product completo
  | { type: 'REMOVE_ITEM'; payload: number } // 👈 CAMBIO: El ID del producto ahora es un 'number'
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } } // 👈 CAMBIO: El ID es 'number'
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  addItem: (item: Product) => void; // 👈 CAMBIO: La función espera un Product
  removeItem: (id: number) => void; // 👈 CAMBIO: El ID es 'number'
  updateQuantity: (id: number, quantity: number) => void; // 👈 CAMBIO: El ID es 'number'
  clearCart: () => void;
}>({} as any);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  devLog('🛒 Acción de carrito disparada:', action.type, 'Payload:', (action as any).payload);

  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        devLog(`   -> El producto "${action.payload.name}" ya existe. Incrementando cantidad.`);
        const items = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          items,
          total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        };
      }
      
      devLog(`   -> Añadiendo nuevo producto al carrito: "${action.payload.name}".`);
      // Añadimos la propiedad 'quantity' al producto que recibimos
      const items = [...state.items, { ...action.payload, quantity: 1 }];
      return {
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
    }
    
    // ... (El resto de los casos del reducer ya son compatibles con el ID numérico)
    case 'REMOVE_ITEM': {
      const items = state.items.filter(item => item.id !== action.payload);
      return {
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const items = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const addItem = (item: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};