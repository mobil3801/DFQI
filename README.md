# Product Portal with Supabase

A modern React TypeScript application with Supabase integration for authentication and database management.

## Features

- 🔐 **Supabase Authentication** - Sign up, sign in, and sign out functionality
- 📊 **Product Management** - CRUD operations for products with React Query
- 🎨 **Modern UI** - Responsive design with dark/light theme support
- ⚡ **Performance Optimized** - React Query caching, memoization, and optimized imports
- 🔒 **Type Safety** - Full TypeScript support with generated database types

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account and project

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd product-portal
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to Settings > API
3. Copy your Project URL and anon/public key

### 3. Environment Configuration

1. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

2. Add your Supabase credentials to the `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

1. In your Supabase dashboard, go to SQL Editor
2. Run the following SQL to create the products table:

```sql
-- Create products table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can view all products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert products" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own products" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own products" ON products
  FOR DELETE USING (auth.role() = 'authenticated');
```

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth.tsx        # Authentication component
│   ├── Header.tsx      # Navigation header
│   └── Footer.tsx      # Footer component
├── lib/                # Utility libraries
│   ├── supabase.ts     # Supabase client configuration
│   └── useSupabase.ts  # Custom hooks for Supabase operations
├── pages/              # Page components
│   ├── ProductList.tsx # Product listing page
│   └── ProductDetail.tsx # Product detail page
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run analyze` - Analyze bundle size

## Supabase Integration

### Authentication
The app uses Supabase Auth for user management:
- Email/password authentication
- Automatic session management
- Protected routes (can be implemented)

### Database Operations
All database operations are handled through custom hooks:
- `useProducts()` - Fetch all products
- `useProduct(id)` - Fetch single product
- `useCreateProduct()` - Create new product
- `useUpdateProduct()` - Update existing product
- `useDeleteProduct()` - Delete product

### Real-time Features
Supabase provides real-time subscriptions that can be easily added:
```typescript
// Example: Subscribe to product changes
const subscription = supabase
  .channel('products')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
    console.log('Change received!', payload)
  })
  .subscribe()
```

## Performance Optimizations

1. **React Query Integration** - Efficient caching and background updates
2. **Memoized Components** - Prevents unnecessary re-renders
3. **Optimized Imports** - Only import needed functions from libraries
4. **Bundle Analysis** - Use `npm run analyze` to identify large dependencies

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.