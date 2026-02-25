'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface BasketContextType {
  isOpen: boolean;
  openBasket: () => void;
  closeBasket: () => void;
  toggleBasket: () => void;
}

const BasketContext = createContext<BasketContextType>({
  isOpen: false,
  openBasket: () => {},
  closeBasket: () => {},
  toggleBasket: () => {},
});

export const useBasketToggle = () => useContext(BasketContext);

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openBasket = useCallback(() => {
    setIsOpen(true);
    document.body.classList.add('is-basket-open');
  }, []);

  const closeBasket = useCallback(() => {
    setIsOpen(false);
    document.body.classList.remove('is-basket-open');
  }, []);

  const toggleBasket = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add('is-basket-open');
      } else {
        document.body.classList.remove('is-basket-open');
      }
      return next;
    });
  }, []);

  return (
    <BasketContext.Provider value={{ isOpen, openBasket, closeBasket, toggleBasket }}>
      {children}
    </BasketContext.Provider>
  );
};
