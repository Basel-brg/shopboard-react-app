# ShopBoard (React Edition) · UI & Component Architecture

A production-grade React 19 + TypeScript e-commerce application for **ShopBoard**, featuring pure component composition, 4-state asynchronous data lifecycle, persistent normalized cart, and strict type safety.

---

## 1. Component Tree & State Ownership

Below is the complete component hierarchy rendered by the application, file for file:

```text
App (State Owner: productsData, cartData, isCartOpen)
│
├── Header
│   └── Props:
│       • cartCount: number
│       • onOpenCart: () => void
│
├── CategoryChips
│   └── Props:
│       • categories: readonly string[]
│       • selectedCategory: string
│       • onSelectCategory: (category: string) => void
│
├── FilterBar
│   └── Props:
│       • searchQuery: string
│       • maxPrice: number
│       • sortBy: SortOption
│       • onSearchChange: (query: string) => void
│       • onPriceChange: (price: number) => void
│       • onSortChange: (sort: SortOption) => void
│       • onResetFilters: () => void
│
├── ProductList
│   ├── Props:
│   │   • products: Product[]
│   │   • loadState: LoadState
│   │   • onAddToCart: (product: Product) => void
│   │   • onRetry: () => void
│   │
│   └── ProductCard (Rendered per item, key={product.id})
│       ├── State Owner: isSaved: boolean (local UI toggle)
│       └── Props:
│           • product: Product
│           • onAddToCart: (product: Product) => void
│
├── CartDrawer
│   ├── State Owner: couponCode: string, couponError: string | null
│   ├── Props:
│   │   • isOpen: boolean
│   │   • cartState: CartState
│   │   • onClose: () => void
│   │   • onUpdateQuantity: (id: number, delta: number) => void
│   │   • onRemoveItem: (id: number) => void
│   │   • onApplyCoupon: (code: string) => boolean
│   │   • onRemoveCoupon: () => void
│   │   • onClearCart: () => void
│   │
│   └── CartItemRow (Rendered per item, key={item.id})
│       └── Props:
│           • item: CartItem
│           • onUpdateQuantity: (id: number, delta: number) => void
│           • onRemoveItem: (id: number) => void
│
└── Footer
    └── Props:
        • copyrightYear?: number
```

---

## 2. State Ownership Table

| State Variable | Type                | Owner             | Description                                                                                                                     |
| -------------- | ------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `productsData` | `ProductsStateData` | `<App />`         | Holds `allProducts`, `filteredProducts`, `filters`, and `loadState`. Subscribed to `productsState`.                             |
| `cartData`     | `CartState`         | `<App />`         | Holds cart items, total count, subtotal, discounts, and shipping. Subscribed to `cart` manager and persisted in `localStorage`. |
| `isCartOpen`   | `boolean`           | `<App />`         | Boolean flag controlling visibility of the slide-over `<CartDrawer />`.                                                         |
| `isSaved`      | `boolean`           | `<ProductCard />` | Local UI state for bookmarking/favoriting a product card.                                                                       |
| `couponCode`   | `string`            | `<CartDrawer />`  | Controlled input state for the discount coupon form.                                                                            |
| `couponError`  | `string \| null`    | `<CartDrawer />`  | Inline validation error message for invalid discount codes.                                                                     |

---

## 3. Key Architecture & Quality Standards

- **Strict Day 3 Logic Reuse**: All `.types`, `.api`, `.logic`, and `.state` files are copied from Day 3 with only `import type` modifications.
- **Zero `any`, Zero `as`, Zero `!`**: The codebase compiles under `"strict": true` without type assertions or escaping compiler safety.
- **Mandatory 4-State UI**:
  - `loading`: Visual skeleton cards (`<ProductList />`).
  - `error`: Actionable error banner with a working **"Try again"** button.
  - `empty`: Distinguishes between empty catalog and "no match" when search/price filters yield zero items.
  - `success`: Populated product grid utilizing stable `key={product.id}` (never array indexes).
- **Cart Persistence**: Cart mutations use delta increments (`+1` / `-1`) and survive full browser refreshes through `localStorage`.
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

# Format codebase
npm run format

# Production build into dist/
npm run build
```

---

## 5. Debug Lab Log Reference

See [`debug-lab-log.md`](./debug-lab-log.md) for the complete root cause analysis and fixes for the 5 bugs identified in `https://shopboard-api.vercel.app/debug-lab`.
