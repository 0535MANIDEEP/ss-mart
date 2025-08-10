// __tests__/CartContext.test.jsx
import { cartReducer } from '../app/components/CartContext';

describe('cartReducer', () => {
  it('adds a product to cart', () => {
    const initialState = { items: [] };
    const product = { id: 1, name: 'Apple', price: 2 };
    const state = cartReducer(initialState, { type: 'ADD', product });
    expect(state.items.length).toBe(1);
    expect(state.items[0].quantity).toBe(1);
  });

  it('removes a product from cart', () => {
    const initialState = { items: [{ id: 1, name: 'Apple', price: 2, quantity: 1 }] };
    const state = cartReducer(initialState, { type: 'REMOVE', id: 1 });
    expect(state.items.length).toBe(0);
  });

  it('updates quantity', () => {
    const initialState = { items: [{ id: 1, name: 'Apple', price: 2, quantity: 1 }] };
    const state = cartReducer(initialState, { type: 'UPDATE_QUANTITY', id: 1, quantity: 5 });
    expect(state.items[0].quantity).toBe(5);
  });
});
