# 🍰 Koket Bakery & Pastry

A modern, production-ready e-commerce web application for a bakery and pastry shop built with Next.js 15, TypeScript, and React Query.

![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.1-38bdf8?logo=tailwindcss)

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog**: Browse products with advanced filtering and search
- **Shopping Cart**: Add/remove items with optimistic updates for instant feedback
- **Custom Cake Orders**: Design custom cakes with personalized requirements
- **User Authentication**: Secure login/signup with JWT tokens
- **Order Tracking**: View order history and track current orders
- **Product Reviews**: Rate and review purchased products
- **Responsive Design**: Mobile-first design that works on all devices

### 👨‍💼 Admin Features
- **Dashboard**: Analytics and overview of shop performance
- **Product Management**: CRUD operations for products with image upload
- **Order Management**: Process and update order statuses
- **Customer Management**: View and manage customer accounts
- **Category Management**: Organize products into categories
- **Review Moderation**: Monitor and respond to customer reviews

### 🚀 Production-Ready Features
- ✅ **Input Validation**: Comprehensive Zod schemas for all forms
- ✅ **Error Boundaries**: Graceful error handling with user-friendly UI
- ✅ **Enhanced Logging**: Structured logging with timestamps and context
- ✅ **Route Protection**: Middleware-based authentication for admin routes
- ✅ **React Query Caching**: Optimized data fetching with automatic caching
- ✅ **Optimistic Updates**: Instant UI feedback for better UX
- ✅ **TypeScript**: Full type safety across the application

## 🛠️ Tech Stack

### Core
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)

### Data & State Management
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **API Client**: [Axios](https://axios-http.com/)
- **Form Validation**: [Zod](https://zod.dev/)
- **State Management**: React Context + React Query

### Development Tools
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Dev Tools**: React Query DevTools

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API server running

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Koket-Bakery-and-pastry/frontend.git
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/app/
├── admin/              # Admin dashboard and management
│   ├── products/       # Product management
│   ├── orders/         # Order management
│   ├── customers/      # Customer management
│   └── dashboard/      # Analytics dashboard
├── auth/               # Authentication pages
│   ├── login/
│   └── signup/
├── cart/               # Shopping cart
├── checkout/           # Checkout process
├── products/           # Product pages
├── orders/             # Order tracking
├── profile/            # User profile
├── components/         # Reusable UI components
├── config/             # App configuration
│   └── queryClient.ts  # React Query setup
├── context/            # React Context providers
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── hooks/              # Custom React hooks
│   ├── useProductsQuery.ts
│   ├── useCartQuery.ts
│   ├── useOrdersQuery.ts
│   └── useCommonQueries.ts
├── schemas/            # Zod validation schemas
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── logger.ts       # Logging utility
│   ├── errorHandler.ts # Error handling
│   └── cookies.ts      # Cookie management
└── providers/          # App providers
    └── QueryProvider.tsx
```

## 🎯 Key Concepts

### React Query Integration

This project uses React Query for efficient data fetching and caching:

```typescript
import { useProductsQuery } from '@/app/hooks/useProductsQuery';

function ProductsList() {
  const { data: products, isLoading, error } = useProductsQuery();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} />;
  
  return <ProductGrid products={products} />;
}
```

See [REACT_QUERY_GUIDE.md](./REACT_QUERY_GUIDE.md) for comprehensive usage examples.

### Form Validation with Zod

All forms use Zod schemas for type-safe validation:

```typescript
import { loginSchema } from '@/app/schemas/authSchemas';

const result = loginSchema.safeParse(formData);
if (!result.success) {
  // Handle validation errors
  const errors = result.error.flatten();
}
```

### Error Handling

Global error boundaries catch and display user-friendly error messages:

```typescript
<ErrorBoundary fallback={<CustomError />}>
  <YourComponent />
</ErrorBoundary>
```

### Route Protection

Admin routes are automatically protected by middleware:
- `/admin/*` routes require authentication and admin role
- Unauthorized users are redirected to login
- JWT tokens validated on every request

## 📚 Documentation

- **[PRODUCTION_IMPROVEMENTS_SUMMARY.md](./PRODUCTION_IMPROVEMENTS_SUMMARY.md)** - Detailed summary of all production improvements
- **[REACT_QUERY_GUIDE.md](./REACT_QUERY_GUIDE.md)** - Complete React Query usage guide
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick reference card for developers

## 🧪 Testing

Run the development server and test key features:

- [ ] User authentication (login/signup)
- [ ] Product browsing and filtering
- [ ] Cart operations (add/remove items)
- [ ] Checkout process
- [ ] Admin dashboard access
- [ ] Product management (CRUD)
- [ ] Order processing

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Koket-Bakery-and-pastry/frontend)

### Environment Variables for Production

Ensure these are set in your production environment:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_JWT_SECRET` - JWT signing secret

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### React Query Settings

Default cache configuration in `src/app/config/queryClient.ts`:
- **Stale Time**: 5 minutes (products), 2 minutes (orders), 1 minute (cart)
- **Cache Time**: 10 minutes
- **Retry**: 2 attempts with exponential backoff

### Custom Breakpoints

Tailwind breakpoints defined in `globals.css`:
- `xss`: 320px (iPhone 5/SE)
- `xs`: 360px (Small Android)
- `sm`: 400px (Medium phones)
- `md`: 480px (Large phones)
- `lg`: 640px (Tablets)
- `xl`: 768px (iPad)
- `2xl`: 1024px (Laptops)
- `3xl`: 1280px (Desktops)
- `4xl`: 1536px (Large screens)

## 🐛 Troubleshooting

### Common Issues

**React Query not fetching data:**
- Check if QueryProvider is wrapping your app in `layout.tsx`
- Verify API endpoint is correct
- Check browser console for errors

**Authentication not working:**
- Verify JWT_SECRET matches backend
- Check if cookies are enabled
- Review middleware configuration in `middleware.ts`

**Build errors:**
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

**Koket Bakery & Pastry Team**
- Repository: [github.com/Koket-Bakery-and-pastry](https://github.com/Koket-Bakery-and-pastry)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [TanStack Query](https://tanstack.com/query/latest) - Data Fetching
- [Zod](https://zod.dev/) - Schema Validation
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vercel](https://vercel.com/) - Hosting Platform

---

**Built with ❤️ by the Koket Bakery Team**
