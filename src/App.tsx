import { useState, useEffect } from 'react';
import type { Product, SortOption } from './modules/products/products.types';
import type { ProductsStateData } from './modules/products/products.state';
import type { CartState } from './modules/cart/cart.types';
import { productsState } from './modules/products/products.state';
import { cart } from './modules/cart/cart.state';
import { CATEGORIES } from './modules/products/products.api';

import { Header } from './components/Header';
import { CategoryChips } from './components/CategoryChips';
import { FilterBar } from './components/FilterBar';
import { ProductList } from './components/ProductList';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';

export default function App() {
  const [productsData, setProductsData] = useState<ProductsStateData>(() =>
    productsState.getState(),
  );
  const [cartData, setCartData] = useState<CartState>(() => cart.getState());
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Subscribe to Day 3 reactive state managers
  useEffect(() => {
    const unsubProducts = productsState.subscribe((state) => {
      setProductsData(state);
    });
    const unsubCart = cart.subscribe((state) => {
      setCartData(state);
    });

    // Load remote products from shopboard API on mount
    productsState.loadRemote().catch(() => {
      // Error handled inside loadRemote and reflected in loadState
    });

    return () => {
      unsubProducts();
      unsubCart();
    };
  }, []);

  function handleAddToCart(product: Product) {
    cart.addItem(product, 1);
  }

  function handleUpdateCartQty(id: number, delta: number) {
    cart.updateQuantity(id, delta);
  }

  function handleRemoveCartItem(id: number) {
    cart.removeItem(id);
  }

  function handleApplyCoupon(code: string): boolean {
    const res = cart.applyCoupon(code);
    return res !== null;
  }

  function handleRemoveCoupon() {
    cart.removeCoupon();
  }

  function handleClearCart() {
    cart.clear();
  }

  function handleRetryLoad() {
    productsState.loadRemote().catch(() => {});
  }

  return (
    <div className="shopboard-app" dir="rtl" lang="ar">
      <Header cartCount={cartData.count} onOpenCart={() => setIsCartOpen(true)} />

      <main className="main-content">
        <section className="hero-section">
          <div className="container hero-inner">
            <span className="hero-eyebrow">أتيليه المكاتب المعمارية</span>
            <h1 className="hero-title">ارتقِ بمساحة عملك</h1>
            <p className="hero-subtitle">
              قطع مكتبية هندسية منتقاة بعناية لبيئة عمل استثنائية وهادئة.
            </p>
          </div>
        </section>

        <section className="catalog-section container">
          <CategoryChips
            categories={CATEGORIES}
            selectedCategory={productsData.filters.category}
            onSelectCategory={(cat) => productsState.setCategory(cat)}
          />

          <FilterBar
            searchQuery={productsData.filters.searchQuery}
            maxPrice={productsData.filters.maxPrice}
            sortBy={productsData.filters.sortBy}
            onSearchChange={(q) => productsState.setSearch(q)}
            onPriceChange={(price) => productsState.setPrice(price)}
            onSortChange={(sort: SortOption) => productsState.setSort(sort)}
            onResetFilters={() => productsState.resetFilters()}
          />

          <ProductList
            products={productsData.filteredProducts}
            loadState={productsData.loadState}
            onAddToCart={handleAddToCart}
            onRetry={handleRetryLoad}
          />
        </section>
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        cartState={cartData}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        onClearCart={handleClearCart}
      />

      <Footer />
    </div>
  );
}
