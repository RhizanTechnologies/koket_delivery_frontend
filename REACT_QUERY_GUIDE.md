# React Query Implementation Guide

## Overview

This project now uses React Query (TanStack Query) for efficient data fetching, caching, and state management. This provides automatic background refetching, optimistic updates, and better user experience.

## Setup

React Query is already configured and integrated:

- ✅ QueryClient configured in `src/app/config/queryClient.ts`
- ✅ QueryProvider wraps the app in `src/app/layout.tsx`
- ✅ Custom hooks created for all major data operations
- ✅ DevTools available in development mode

## Available Hooks

### Products

```typescript
import {
  useProductsQuery,
  useProductQuery,
  useProductsByCategoryQuery,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/app/hooks/useProductsQuery';

// Fetch all products
function ProductsList() {
  const { data: products, isLoading, error } = useProductsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{products?.map(product => ...)}</div>;
}

// Fetch single product
function ProductDetail({ id }: { id: string }) {
  const { data: product, isLoading } = useProductQuery(id);

  return <div>{product?.name}</div>;
}

// Create product (admin)
function CreateProductForm() {
  const createProduct = useCreateProduct();

  const handleSubmit = async (data) => {
    await createProduct.mutateAsync(data);
    // Cache automatically updated!
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Cart (with Optimistic Updates)

```typescript
import {
  useCartQuery,
  useAddToCart,
  useRemoveFromCart,
  useUpdateCartItem,
  useClearCart,
} from '@/app/hooks/useCartQuery';

// Fetch cart items
function Cart() {
  const { data: cartItems, isLoading } = useCartQuery();

  return <div>{cartItems?.map(item => ...)}</div>;
}

// Add to cart with instant UI update
function AddToCartButton({ productId }: { productId: string }) {
  const addToCart = useAddToCart();

  const handleAdd = async () => {
    // UI updates immediately, then syncs with server
    await addToCart.mutateAsync({
      product_id: productId,
      quantity: 1,
    });
  };

  return <button onClick={handleAdd}>Add to Cart</button>;
}

// Remove from cart
function RemoveButton({ itemId }: { itemId: string }) {
  const removeFromCart = useRemoveFromCart();

  return (
    <button onClick={() => removeFromCart.mutate(itemId)}>
      Remove
    </button>
  );
}

// Update quantity
function QuantitySelector({ itemId, currentQty }: Props) {
  const updateItem = useUpdateCartItem();

  const handleChange = (newQty: number) => {
    updateItem.mutate({ itemId, quantity: newQty });
  };

  return <input type="number" value={currentQty} onChange={handleChange} />;
}
```

### Orders

```typescript
import {
  useOrdersQuery,
  useOrderQuery,
  useCreateOrder,
  useUpdateOrder,
  useCancelOrder,
} from '@/app/hooks/useOrdersQuery';

// Fetch user's orders
function OrdersList() {
  const { data: orders, isLoading } = useOrdersQuery();

  return <div>{orders?.map(order => ...)}</div>;
}

// Fetch single order
function OrderDetail({ orderId }: { orderId: string }) {
  const { data: order } = useOrderQuery(orderId);

  return <div>Order #{order?.id}</div>;
}

// Create order
function CheckoutButton() {
  const createOrder = useCreateOrder();

  const handleCheckout = async (orderData) => {
    const newOrder = await createOrder.mutateAsync(orderData);
    // Cart cache automatically cleared!
    // Orders cache automatically updated!
  };

  return <button onClick={handleCheckout}>Place Order</button>;
}
```

### Categories & User Profile

```typescript
import {
  useCategoriesQuery,
  useProfileQuery,
  useUpdateProfile,
  useUserOrders,
  useUserReviews,
} from '@/app/hooks/useCommonQueries';

// Fetch categories
function CategoryNav() {
  const { data: categories } = useCategoriesQuery();

  return <nav>{categories?.map(cat => ...)}</nav>;
}

// Fetch user profile
function ProfilePage() {
  const { data: user } = useProfileQuery();
  const updateProfile = useUpdateProfile();

  const handleSave = async (updates) => {
    await updateProfile.mutateAsync(updates);
    // Profile cache automatically updated!
  };

  return <div>{user?.name}</div>;
}
```

## Key Features

### 1. Automatic Caching

Data is cached automatically. Subsequent requests for the same data return cached results instantly.

```typescript
// First call - fetches from server
const { data } = useProductsQuery();

// Navigate away and come back - returns cached data instantly!
// Background refetch happens automatically after 5 minutes
```

### 2. Optimistic Updates

Cart operations update the UI immediately, then sync with the server.

```typescript
// User clicks "Add to Cart"
// ✅ Item appears in cart INSTANTLY
// 🔄 Request sent to server in background
// ✅ If successful - done!
// ❌ If fails - UI rolls back automatically
```

### 3. Automatic Refetching

Data refetches automatically:

- When window regains focus
- When network reconnects
- After specified stale time
- When you invalidate queries

### 4. Loading & Error States

Built-in loading and error handling:

```typescript
const { data, isLoading, error, isError } = useProductsQuery();

if (isLoading) return <LoadingSpinner />;
if (isError) return <ErrorState error={error} />;
return <ProductsList products={data} />;
```

### 5. Cache Invalidation

Mutations automatically invalidate related queries:

```typescript
// When creating a product, products list is automatically refetched
const createProduct = useCreateProduct();

// When creating an order, cart and orders are automatically updated
const createOrder = useCreateOrder();
```

## Query Keys Structure

Query keys are organized for easy cache management:

```typescript
// Products
queryKeys.products.all; // ["products"]
queryKeys.products.detail(id); // ["products", "detail", id]
queryKeys.products.list({ category }); // ["products", "list", { category }]

// Cart
queryKeys.cart.all; // ["cart"]

// Orders
queryKeys.orders.all; // ["orders"]
queryKeys.orders.detail(id); // ["orders", "detail", id]

// Categories
queryKeys.categories.all; // ["categories"]

// User
queryKeys.user.profile(); // ["user", "profile"]
queryKeys.user.orders(); // ["user", "orders"]
queryKeys.user.reviews(); // ["user", "reviews"]
```

## Development Tools

In development mode, React Query DevTools are available:

- Click the floating icon at the bottom of the screen
- View all queries and their states
- See cached data
- Debug refetching behavior
- Inspect mutations

## Migration Guide

### Before (Direct API Calls)

```typescript
// ❌ Old way
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  api
    .get("/products")
    .then((res) => setProducts(res.data))
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
}, []);
```

### After (React Query)

```typescript
// ✅ New way
const { data: products, isLoading } = useProductsQuery();

// That's it! Caching, refetching, error handling all included
```

## Best Practices

1. **Use Query Hooks**: Always use the custom hooks instead of calling API directly
2. **Leverage Caching**: Don't refetch data unnecessarily - trust the cache
3. **Optimistic Updates**: Use for better UX in cart/favorites operations
4. **Error Handling**: Always handle error states in components
5. **Loading States**: Show loading indicators for better UX

## Configuration

Default settings (can be customized in `queryClient.ts`):

- **Stale Time**: 5 minutes (products), 1 minute (cart), 2 minutes (orders)
- **Cache Time**: 10 minutes (garbage collection)
- **Retry**: 2 attempts with exponential backoff
- **Refetch on Window Focus**: Enabled
- **Refetch on Reconnect**: Enabled

## Troubleshooting

### Data not updating?

Check if you're invalidating the correct query keys after mutations.

### Too many requests?

Increase `staleTime` in query configuration.

### Cached data is stale?

Decrease `staleTime` or manually invalidate with:

```typescript
queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
```

### Need fresh data immediately?

```typescript
const { refetch } = useProductsQuery();
await refetch(); // Force immediate refetch
```

## Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)
- [Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
