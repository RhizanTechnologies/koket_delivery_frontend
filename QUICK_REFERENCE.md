# Quick Reference Card - Production Improvements

## 🎯 Quick Access Guide

### Zod Validation
```typescript
// Import schema
import { loginSchema } from '@/app/schemas/authSchemas';

// Validate data
const result = loginSchema.safeParse(formData);
if (!result.success) {
  // Handle errors: result.error.flatten()
}
```

**Schemas Location:** `src/app/schemas/`

---

### Error Handling
```typescript
// Throw custom errors
import { AppError } from '@/app/utils/errorHandler';
throw new AppError('Not found', 404, 'RESOURCE_NOT_FOUND');

// Wrap risky code
<ErrorBoundary fallback={<CustomError />}>
  <RiskyComponent />
</ErrorBoundary>
```

**Files:** `src/app/components/ErrorBoundary.tsx`, `src/app/utils/errorHandler.ts`

---

### Logging
```typescript
import { logger } from '@/app/utils/logger';

logger.info('User logged in', { userId: '123' }, 'Auth');
logger.warn('Low stock', { productId: 'abc' }, 'Inventory');
logger.error('Payment failed', { error }, 'Payment');
```

**Files:** `src/app/utils/logger.ts`, `src/app/utils/apiLogger.ts`

---

### React Query - Quick Start

**Fetch Data:**
```typescript
import { useProductsQuery } from '@/app/hooks/useProductsQuery';

function Component() {
  const { data, isLoading, error } = useProductsQuery();
  
  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;
  
  return <div>{data.map(...)}</div>;
}
```

**Mutate Data:**
```typescript
import { useCreateProduct } from '@/app/hooks/useProductsQuery';

function Component() {
  const createProduct = useCreateProduct();
  
  const handleSubmit = async (data) => {
    await createProduct.mutateAsync(data);
    // Cache automatically updated!
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Cart Operations (Optimistic):**
```typescript
import { useAddToCart } from '@/app/hooks/useCartQuery';

function AddButton({ productId }) {
  const addToCart = useAddToCart();
  
  return (
    <button onClick={() => addToCart.mutate({ product_id: productId, quantity: 1 })}>
      Add to Cart
    </button>
  );
}
```

---

## 📂 File Structure

```
src/app/
├── schemas/              # Zod validation schemas
│   ├── authSchemas.ts
│   ├── productSchemas.ts
│   ├── orderSchemas.ts
│   └── ...
├── utils/
│   ├── logger.ts         # Logging utility
│   ├── apiLogger.ts      # API request/response logger
│   ├── errorHandler.ts   # Error handling utilities
│   └── cookies.ts        # Cookie management
├── components/
│   └── ErrorBoundary.tsx # Reusable error boundary
├── hooks/
│   ├── useProductsQuery.ts
│   ├── useOrdersQuery.ts
│   ├── useCartQuery.ts
│   └── useCommonQueries.ts
├── config/
│   └── queryClient.ts    # React Query configuration
├── providers/
│   └── QueryProvider.tsx # Query provider wrapper
└── context/
    ├── AuthContext.tsx   # Enhanced with dual storage
    └── CartContext.tsx
```

---

## 🔑 Available Hooks

### Products
- `useProductsQuery()` - All products
- `useProductQuery(id)` - Single product
- `useProductsByCategoryQuery(categoryId)` - By category
- `useCreateProduct()` - Create (admin)
- `useUpdateProduct()` - Update (admin)
- `useDeleteProduct()` - Delete (admin)

### Cart
- `useCartQuery()` - Cart items
- `useAddToCart()` - Add item (optimistic)
- `useRemoveFromCart()` - Remove item (optimistic)
- `useUpdateCartItem()` - Update quantity (optimistic)
- `useClearCart()` - Clear cart

### Orders
- `useOrdersQuery()` - User's orders
- `useOrderQuery(id)` - Single order
- `useCreateOrder()` - Place order
- `useUpdateOrder()` - Update (admin)
- `useCancelOrder()` - Cancel order

### Common
- `useCategoriesQuery()` - All categories
- `useProfileQuery()` - User profile
- `useUpdateProfile()` - Update profile
- `useUserOrders()` - Order history
- `useUserReviews()` - User's reviews

---

## ⚙️ Configuration

### Query Stale Times
- Products: **5 minutes**
- Categories: **10 minutes**
- Profile: **5 minutes**
- Orders: **2 minutes**
- Cart: **1 minute**

### Cache Settings
- GC Time: **10 minutes**
- Retry: **2 attempts**
- Exponential backoff enabled

---

## 🛡️ Protected Routes

All `/admin/*` routes are protected by middleware:
- Requires valid JWT token in cookies
- Requires admin role
- Auto-redirects to login if unauthorized

---

## 🐛 Debugging

### Check Logs
Browser Console → Structured logs with timestamps and context

### React Query DevTools
- Look for floating icon at bottom of screen (dev mode only)
- Click to inspect all queries, mutations, and cache

### Check Errors
Components wrapped in ErrorBoundary will show friendly error UI

---

## 📝 Common Patterns

### Loading State
```typescript
const { data, isLoading } = useQuery();
if (isLoading) return <LoadingSpinner />;
```

### Error State
```typescript
const { data, error, isError } = useQuery();
if (isError) return <ErrorState error={error} />;
```

### Mutation with Feedback
```typescript
const mutation = useMutation();

const handleSubmit = async () => {
  try {
    await mutation.mutateAsync(data);
    toast.success('Success!');
  } catch (error) {
    toast.error('Failed!');
  }
};
```

### Manual Refetch
```typescript
const { data, refetch } = useQuery();

<button onClick={() => refetch()}>Refresh</button>
```

### Invalidate Cache
```typescript
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/app/config/queryClient';

const queryClient = useQueryClient();

queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
```

---

## 🚀 Performance Tips

1. **Trust the cache** - Don't refetch unnecessarily
2. **Use optimistic updates** for instant UI feedback
3. **Leverage stale-while-revalidate** - Show cached data while fetching fresh
4. **Prefetch data** on hover/focus for faster navigation
5. **Use pagination/infinite scroll** for large lists

---

## 📚 Documentation

- **Full React Query Guide:** `REACT_QUERY_GUIDE.md`
- **Complete Summary:** `PRODUCTION_IMPROVEMENTS_SUMMARY.md`
- **TanStack Query Docs:** https://tanstack.com/query/latest

---

## ✅ Quick Test Checklist

- [ ] Forms validate input correctly
- [ ] Errors show user-friendly messages
- [ ] Logs appear in console
- [ ] Admin routes redirect when not authorized
- [ ] Data loads from cache on navigation
- [ ] Cart updates instantly when adding/removing items
- [ ] DevTools show query states correctly

---

**Need help?** Check the full guides or TanStack Query documentation.
