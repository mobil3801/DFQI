-- Product Portal Database Setup
-- Run this script in your Supabase SQL Editor

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
CREATE POLICY "Users can view all products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert products" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own products" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own products" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO products (name, description, price, image_url, category, rating) VALUES
('Laptop Pro', 'High-performance laptop for professionals', 1299.99, 'https://picsum.photos/300/200?random=1', 'Electronics', 4.5),
('Wireless Headphones', 'Noise-cancelling wireless headphones', 199.99, 'https://picsum.photos/300/200?random=2', 'Electronics', 4.2),
('Smartphone X', 'Latest smartphone with advanced features', 899.99, 'https://picsum.photos/300/200?random=3', 'Electronics', 4.7),
('Running Shoes', 'Comfortable running shoes for athletes', 89.99, 'https://picsum.photos/300/200?random=4', 'Clothing', 4.3),
('Coffee Maker', 'Automatic coffee maker for home use', 149.99, 'https://picsum.photos/300/200?random=5', 'Home', 4.1),
('Programming Book', 'Complete guide to modern programming', 49.99, 'https://picsum.photos/300/200?random=6', 'Books', 4.6),
('Gaming Console', 'Next-gen gaming console', 499.99, 'https://picsum.photos/300/200?random=7', 'Electronics', 4.8),
('Yoga Mat', 'Premium yoga mat for fitness enthusiasts', 29.99, 'https://picsum.photos/300/200?random=8', 'Home', 4.0),
('Designer Watch', 'Luxury designer watch', 299.99, 'https://picsum.photos/300/200?random=9', 'Clothing', 4.4),
('Cookbook', 'Collection of delicious recipes', 24.99, 'https://picsum.photos/300/200?random=10', 'Books', 4.2)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);