import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { addItem, removeItem, updateQuantity, clearCart } from '@/features/cart/slice/cartSlice';
import type { CartItem } from '@/features/cart/types';

function makeStore() {
  return configureStore({ reducer: { cart: cartReducer } });
}

const itemA: CartItem = { productId: 'p1', name: 'Headphones', price: 249.99, image: 'img1.jpg', quantity: 1 };
const itemB: CartItem = { productId: 'p2', name: 'Keyboard', price: 129.99, image: 'img2.jpg', quantity: 2 };

describe('cartSlice', () => {
  it('initial state is an empty cart', () => {
    const store = makeStore();
    expect(store.getState().cart.items).toHaveLength(0);
  });

  it('addItem adds a new product to the cart', () => {
    const store = makeStore();
    store.dispatch(addItem(itemA));
    expect(store.getState().cart.items).toHaveLength(1);
    expect(store.getState().cart.items[0]).toEqual(itemA);
  });

  it('addItem increments quantity when the product already exists', () => {
    const store = makeStore();
    store.dispatch(addItem(itemA));
    store.dispatch(addItem({ ...itemA, quantity: 2 }));
    const items = store.getState().cart.items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });

  it('addItem supports multiple distinct products', () => {
    const store = makeStore();
    store.dispatch(addItem(itemA));
    store.dispatch(addItem(itemB));
    expect(store.getState().cart.items).toHaveLength(2);
  });

  it('removeItem removes the specified product', () => {
    const store = makeStore();
    store.dispatch(addItem(itemA));
    store.dispatch(addItem(itemB));
    store.dispatch(removeItem('p1'));
    const items = store.getState().cart.items;
    expect(items).toHaveLength(1);
    expect(items[0].productId).toBe('p2');
  });

  it('updateQuantity changes the item quantity', () => {
    const store = makeStore();
    store.dispatch(addItem(itemA));
    store.dispatch(updateQuantity({ productId: 'p1', quantity: 5 }));
    expect(store.getState().cart.items[0].quantity).toBe(5);
  });

  it('updateQuantity enforces a minimum quantity of 1', () => {
    const store = makeStore();
    store.dispatch(addItem(itemA));
    store.dispatch(updateQuantity({ productId: 'p1', quantity: 0 }));
    expect(store.getState().cart.items[0].quantity).toBe(1);
  });

  it('clearCart empties all items', () => {
    const store = makeStore();
    store.dispatch(addItem(itemA));
    store.dispatch(addItem(itemB));
    store.dispatch(clearCart());
    expect(store.getState().cart.items).toHaveLength(0);
  });

  it('addItem persists cart to localStorage', () => {
    const store = makeStore();
    store.dispatch(addItem(itemA));
    const stored = JSON.parse(localStorage.getItem('mvep_cart')!);
    expect(stored).toHaveLength(1);
    expect(stored[0].productId).toBe('p1');
  });

  it('removeItem persists updated cart to localStorage', () => {
    const store = makeStore();
    store.dispatch(addItem(itemA));
    store.dispatch(addItem(itemB));
    store.dispatch(removeItem('p1'));
    const stored = JSON.parse(localStorage.getItem('mvep_cart')!);
    expect(stored).toHaveLength(1);
    expect(stored[0].productId).toBe('p2');
  });

  it('clearCart writes an empty array to localStorage', () => {
    const store = makeStore();
    store.dispatch(addItem(itemA));
    store.dispatch(clearCart());
    const stored = JSON.parse(localStorage.getItem('mvep_cart')!);
    expect(stored).toHaveLength(0);
  });
});
