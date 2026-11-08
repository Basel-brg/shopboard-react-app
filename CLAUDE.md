# ShopBoard (React Edition) - Engineering Rules & Standards

## 1. The Stack

- **Framework & Runtime**: React 19, Vite, TypeScript ("strict": true, zero `any` policy).
- **Styling**: Pure CSS3 with `:root` CSS Design Tokens and BEM conventions.
- **Linting & Formatting**: ESLint 9 (flat config) + Prettier with Husky and lint-staged.
- **Skills**: `.claude/skills/vercel-react-best-practices` & `.claude/skills/vercel-composition-patterns`.

---

## 2. Folder Structure & Where New Features Go

```text
src/
├── components/          # Reusable dumb presentational components (one per file)
│   ├── Header.tsx
│   ├── CategoryChips.tsx
│   ├── FilterBar.tsx
│   ├── ProductCard.tsx
│   ├── ProductList.tsx
│   ├── CartDrawer.tsx
│   ├── CartItemRow.tsx
│   └── Footer.tsx
├── modules/             # Business domain modules (copied from Day 3)
│   ├── products/
│   │   ├── products.types.ts
│   │   ├── products.api.ts
│   │   ├── products.logic.ts
│   │   └── products.state.ts
│   └── cart/
│       ├── cart.types.ts
│       ├── cart.logic.ts
│       └── cart.state.ts
├── shared/
│   ├── api/client.ts    # Centralized API fetch wrapper
│   └── validation.ts    # Input and coupon validation
├── App.tsx              # Root orchestration and state bridge
├── main.tsx             # React entry point
└── style.css            # Akari Desk Atelier design tokens and styling
```

### Where a New Feature Goes:

1. **Types**: Add domain models to `src/modules/<feature>/<feature>.types.ts`.
2. **Logic**: Write pure calculation and filtering functions in `src/modules/<feature>/<feature>.logic.ts`.
3. **State / API**: Add API callers in `*.api.ts` and state manager in `*.state.ts`.
4. **Components**: Build single-responsibility components in `src/components/<FeatureComponent>.tsx` with a typed `Props` interface.

---

## 3. Rules from Mistakes WE Saw Today (In Our Own Words)

### Rule 1: Never Use Array Index as React Key (`key={index}`)

- **The Mistake**: Using `key={index}` in `.map()` when items can be sorted or filtered. React re-uses existing DOM nodes and component instances based on key index, causing local component state (like saved hearts or input values) to jump to the wrong product.
- **The Rule**: Always use a permanent, unique identifier from data (e.g. `key={product.id}`). If rendering a list of primitive strings, use the string itself (e.g. `key={category}`).

### Rule 2: Never Use Falsy Numbers in Conditional JSX (`{count && <Component />}`)

- **The Mistake**: Writing `{stock && <span>Only {stock} left</span>}` or `{cart.length && <CartList />}`. In JavaScript, `0 && <JSX>` evaluates to the number `0`, which React renders as visible text `"0"` in the DOM.
- **The Rule**: Always use strict boolean expressions: `{stock > 0 && <span>Only {stock} left</span>}` or `{cart.length > 0 && <CartList />}`.

### Rule 3: Never Mutate Arrays or State Objects In-Place

- **The Mistake**: Calling `products.sort()` on arrays passed via props, or doing `item.qty++` inside a child component. This mutates the original reference, breaks default sort order, and prevents React from re-rendering because `Object.is(prev, next)` remains true.
- **The Rule**: Always copy before sorting (`[...products].sort()`), and use immutable update callbacks from parent state owners (e.g. `setCart(prev => prev.map(...))`).

### Rule 4: Zero `any`, Zero `as`, Zero `!`

- **The Mistake**: Using `as Product` or non-null assertion `!` to bypass compiler checks.
- **The Rule**: Write explicit type guards (e.g. `isSortOption(val)`) and safe narrowing functions so the TypeScript compiler verifies types at compile time and runtime.
