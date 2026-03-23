'use client';

import React from 'react';
import Basket from '@/components/organisms/basket';
import { useBasketToggle } from '@/components/providers/basket-provider';

const BasketDrawer: React.FC = () => {
  const { isOpen, closeBasket } = useBasketToggle();

  return <Basket isOpen={isOpen} onClose={closeBasket} />;
};

export default BasketDrawer;
