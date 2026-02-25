'use client';

import React from 'react';
import Basket from '@/components/Basket';
import { useBasketToggle } from '@/components/providers/BasketProvider';

const BasketDrawer: React.FC = () => {
  const { isOpen, closeBasket } = useBasketToggle();

  return <Basket isOpen={isOpen} onClose={closeBasket} />;
};

export default BasketDrawer;
