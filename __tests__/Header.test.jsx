// __tests__/Header.test.jsx
import React from 'react';
import { render } from '@testing-library/react';
import Header from '../app/components/Header';
import { CartContext } from '../app/components/CartContext';

describe('Header', () => {
  it('shows cart count', () => {
    const contextValue = { items: [{ id: 1, quantity: 2 }, { id: 2, quantity: 1 }] };
    const { getByText } = render(
      <CartContext.Provider value={contextValue}>
        <Header />
      </CartContext.Provider>
    );
    expect(getByText('Cart')).toBeInTheDocument();
    expect(getByText('3')).toBeInTheDocument();
  });
});
