
/**
 * CartContext provides global cart state and actions for the SS Mart app.
 * Usage:
 *   - Wrap your app with <CartProvider>
 *   - Use useCart() to access cart items and actions in any component
 *
 * TODO: Upgrade Node.js to v20+ for future Supabase compatibility.
 * See: https://github.com/orgs/supabase/discussions/37217
 */

"use client";
import React, { createContext, useReducer, useMemo, useEffect } from 'react';

const initialState = {
  items: [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, items: action.items };
    case 'ADD': {
      const existing = state.items.find(item => item.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.product, quantity: 1 }],
      };
    }
    case 'REMOVE':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.id),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.id
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}


import { useContext } from 'react';
export const CartContext = createContext();
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Persist cart to localStorage
  useEffect(() => {
    const stored = localStorage.getItem('ssmart_cart');
    if (stored) {
      dispatch({ type: 'INIT', items: JSON.parse(stored) });
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('ssmart_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = product => dispatch({ type: 'ADD', product });
  const removeFromCart = id => dispatch({ type: 'REMOVE', id });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const value = useMemo(() => ({
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }), [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
