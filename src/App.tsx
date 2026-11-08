import React, { useState } from 'react';
import { useAuth } from './modules/auth/context/useAuth';
import { useCart } from './modules/cart/context/useCart';
import { useOrders } from './modules/orders/context/useOrders';
import { useProducts } from './modules/products/context/useProducts';

import { ProductsHero } from './modules/products/components/ProductsHero';
import { ProductsContainer } from './modules/products/components/ProductsContainer';
import { CartDrawer } from './modules/cart/components/CartDrawer';
import { AuthModal } from './modules/auth/components/AuthModal';
import { OrdersModal } from './modules/orders/components/OrdersModal';
import { OrderConfirmationModal } from './modules/orders/components/OrderConfirmationModal';
import { DeskStudioContainer } from './desk-builder/DeskStudioContainer';
import { Footer } from './shared/components/Footer/Footer';

export const App: React.FC = () => {
  const [isDeskStudioOpen, setIsDeskStudioOpen] = useState(false);

  const { user, openModal: openAuthModal } = useAuth();
  const { toggleCart, state: cartState, addItem } = useCart();
  const { openOrdersModal, confirmedOrder, closeOrderConfirmed } = useOrders();
  const { setCategory } = useProducts();

  return (
    <div id="app">
      {/* First Viewport: Comp-1 Atelier Rail & Hero Stage */}
      <ProductsHero
        onOpenDeskStudio={() => setIsDeskStudioOpen(true)}
        onOpenOrders={openOrdersModal}
        onOpenAuth={openAuthModal}
        onToggleCart={toggleCart}
        cartCount={cartState.count}
        cartTotal={cartState.total}
        userName={user?.name}
        onAddToCart={addItem}
      />

      {/* Main Products Workshop Catalog */}
      <ProductsContainer />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer />

      {/* Auth Login / Register Modal */}
      <AuthModal />

      {/* Orders Management Modal */}
      <OrdersModal />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal order={confirmedOrder} onClose={closeOrderConfirmed} />

      {/* 3D Desk Studio Modal */}
      <DeskStudioContainer isOpen={isDeskStudioOpen} onClose={() => setIsDeskStudioOpen(false)} />

      {/* Store Footer */}
      <Footer onSelectCategory={setCategory} />
    </div>
  );
};

export default App;
