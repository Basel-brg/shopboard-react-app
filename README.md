# ShopBoard (React Edition) · Akari Desk Atelier

A production-grade React 19 + TypeScript e-commerce and 3D WebGL application for **ShopBoard**, featuring pure component composition, 4-state asynchronous data lifecycle, persistent normalized cart, interactive 3D Desk Studio, and strict type safety.

---

## 1. Component Tree & State Ownership

Below is the complete component hierarchy rendered by the application, file for file, matching React DevTools Components tab:

```text
App (State Owner: isDeskStudioOpen)
│
├── ProductsHero
│   ├── State Owner: None (Pure presentational)
│   └── Props:
│       • onOpenDeskStudio: () => void
│       • onOpenOrders: () => void
│       • onOpenAuth: () => void
│       • onToggleCart: () => void
│       • cartCount: number
│       • cartTotal: number
│       • userName: string | undefined
│       • onAddToCart: (product: Product, quantity?: number) => void
│
├── ProductsContainer
│   ├── State Owner: None (Consumes ProductsContext & CartContext)
│   ├── Props: None
│   │
│   ├── ProductsFilterBar
│   │   ├── State Owner: None (Pure presentational)
│   │   └── Props:
│   │       • searchQuery: string
│   │       • category: string
│   │       • maxPrice: number
│   │       • sortBy: SortOption
│   │       • onSearchChange: (query: string) => void
│   │       • onCategoryChange: (category: string) => void
│   │       • onPriceChange: (price: number) => void
│   │       • onSortChange: (sort: SortOption) => void
│   │       • onResetFilters: () => void
│   │
│   ├── ProductsSkeleton (Rendered during loading state)
│   │   └── Props: None
│   │
│   ├── ProductsList (Rendered on success)
│   │   ├── State Owner: None
│   │   ├── Props:
│   │   │   • products: Product[]
│   │   │   • onAddToCart: (product: Product) => void
│   │   │   • onQuickView: (product: Product) => void
│   │   │
│   │   └── ProductCard (Rendered per product, key={product.id})
│   │       ├── State Owner: isFavorited: boolean
│   │       └── Props:
│   │           • product: Product
│   │           • onAddToCart: (product: Product) => void
│   │           • onQuickView: (product: Product) => void
│   │
│   └── ProductQuickViewModal
│       ├── State Owner: quantity: number
│       └── Props:
│           • product: Product | null
│           • isOpen: boolean
│           • onClose: () => void
│           • onAddToCart: (product: Product, quantity: number) => void
│
├── CartDrawer
│   ├── State Owner: couponInput: string, isCheckingOut: boolean
│   ├── Props: None (Consumes CartContext)
│   │
│   ├── CartItemRow (Rendered per item, key={item.id})
│   │   └── Props:
│   │       • item: CartItem
│   │       • onUpdateQuantity: (id: number, delta: number) => void
│   │       • onRemove: (id: number) => void
│   │
│   └── CheckoutForm
│       ├── State Owner: formData (name, phone, address, paymentMethod)
│       └── Props:
│           • onSubmit: (info: CustomerInfo) => Promise<void>
│           • isSubmitting: boolean
│
├── AuthModal
│   ├── State Owner: activeTab: 'login' | 'register', loginForm, registerForm, error: string | null
│   └── Props: None (Consumes AuthContext)
│
├── OrdersModal
│   ├── State Owner: searchQuery: string, statusFilter: 'all' | OrderStatus, selectedOrder: Order | null
│   ├── Props: None (Consumes OrdersContext)
│   │
│   ├── OrderCard (Rendered per order, key={order.id})
│   │   └── Props:
│   │       • order: Order
│   │       • onViewDetails: (order: Order) => void
│   │
│   └── OrderDetailsModal
│       └── Props:
│           • order: Order | null
│           • onClose: () => void
│
├── OrderConfirmationModal
│   └── Props:
│       • order: Order | null
│       • onClose: () => void
│
├── DeskStudioContainer (DeskStudioModal)
│   ├── State Owner: selectedItem: DeskSceneItem | null, activeTab: 'catalog' | 'materials' | 'items', deskDimensions
│   └── Props:
│       • isOpen: boolean
│       • onClose: () => void
│
└── Footer
    └── Props:
        • onSelectCategory?: (category: string) => void
```

---

## 2. State Ownership Table

| State Variable                       | Type            | Owner                 | Description                                                                                                     |
| ------------------------------------ | --------------- | --------------------- | --------------------------------------------------------------------------------------------------------------- |
| `products` / `loadState` / `filters` | Domain State    | `ProductsContext`     | Catalog state, 4-state lifecycle (`loading`, `error`, `empty`, `success`), search, category, and price filters. |
| `cartState` / `items` / `coupon`     | Domain State    | `CartContext`         | Persistent shopping cart with delta updates, coupons, discounts, and taxes. Persisted to `localStorage`.        |
| `orders` / `loadState`               | Domain State    | `OrdersContext`       | Orders history, live status tracking, and 4-state async view.                                                   |
| `user` / `isAuthenticated`           | Domain State    | `AuthContext`         | Active user credentials and profile state.                                                                      |
| `isDeskStudioOpen`                   | `boolean`       | `<App />`             | Controls visibility of the full-screen 3D WebGL Desk Studio.                                                    |
| `isFavorited`                        | `boolean`       | `<ProductCard />`     | Local heart toggle for bookmarking a product.                                                                   |
| `formData`                           | Form Object     | `<CheckoutForm />`    | Controlled checkout inputs (name, phone, shipping address, payment method).                                     |
| `selectedItem` / `tab`               | 3D Studio State | `<DeskStudioModal />` | Selected accessory, active tool panel, and desk width/depth slider values.                                      |

---

## 3. Key Architecture & Quality Standards

- **Strict Day 3 Logic Reuse**: All `.types`, `.api`, `.logic`, and `.state` files are copied from Day 3 with only `import type` modifications.
- **Zero `any`, Zero `as`, Zero `!`**: Strict TypeScript mode without arbitrary type assertions or escaping compiler verification.
- **Mandatory 4-State UI**:
  - `loading`: Visual skeleton/shimmer cards (`<ProductsSkeleton />`).
  - `error`: Actionable error banner with a functional **"Try again"** button.
  - `empty`: Distinguishes between empty catalog and "no match" when search/price filters yield zero items.
  - `success`: Populated product grid utilizing stable `key={product.id}` (never array indexes).
- **Persistent Cart**: Cart mutations use delta increments (`+1` / `-1`) and survive full browser refreshes through `localStorage`.
- **Committed Vercel Skills**:
  - `.claude/skills/vercel-react-best-practices/SKILL.md`
  - `.claude/skills/vercel-composition-patterns/SKILL.md`

---

## 4. Development & Build Commands

```bash
# Start local Vite development server
npm run dev

# Run TypeScript type check
npm run typecheck

# Run ESLint (passes with 0 warnings)
npm run lint

# Check code formatting with Prettier
npm run format:check

# Run Vitest unit tests
npm test

# Run Playwright E2E browser tests
npm run test:e2e

# Production build into dist/
npm run build
```

---

## 5. Debug Lab Log Reference

See [`debug-lab-log.md`](./debug-lab-log.md) for the complete root cause analysis and fixes for the 5 bugs identified in `https://shopboard-api.vercel.app/debug-lab`.
