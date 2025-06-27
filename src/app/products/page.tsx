'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Package } from 'lucide-react';
import type { Product } from '@/types/product';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Package className="w-8 h-8 text-primary"/>
                Saved Products
            </h1>
            <Link href="/" passHref>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
            </Link>
          </div>
          {products.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Card key={product.id} className="shadow-md flex flex-col">
                  <CardHeader>
                    <CardTitle className="truncate">{product.title}</CardTitle>
                    <CardDescription>{product.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                    <p className="text-2xl font-bold mb-2">₹{product.price.toLocaleString('en-IN')}</p>
                    <p className="text-muted-foreground text-sm mb-4 flex-grow h-20 overflow-hidden text-ellipsis">
                      {product.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-auto">
                        {product.keywords.split(',').map((kw, i) => (
                            <span key={i} className="text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-1">
                                {kw.trim()}
                            </span>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
              <h2 className="text-xl font-semibold">No Products Yet</h2>
              <p className="text-muted-foreground mt-2">Start creating your first product listing!</p>
              <Link href="/" passHref>
                <Button className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Product
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
