'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, RefreshCw } from 'lucide-react';
import type { GenerateProductDescriptionOutput } from '@/ai/flows/generate-product-description';
import type { Product } from '@/types/product';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
  category: z.string().min(3, { message: 'Category must be at least 3 characters long.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
  keywords: z.string().min(3, { message: 'Please provide some keywords.' }),
});

interface ProductFormProps {
  productData: GenerateProductDescriptionOutput;
  onRestart: () => void;
}

export function ProductForm({ productData, onRestart }: ProductFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: productData.suggestedTitle,
      category: productData.suggestedCategory,
      price: productData.suggestedPrice,
      description: productData.productDescription,
      keywords: productData.suggestedKeywords,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const newProduct: Product = { id: new Date().toISOString(), ...values };
      const existingProducts: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
      const updatedProducts = [...existingProducts, newProduct];
      localStorage.setItem('products', JSON.stringify(updatedProducts));

      toast({
        title: 'Product Saved!',
        description: 'Your new product listing has been successfully saved.',
        variant: 'default',
      });

      router.push('/products');
    } catch (error) {
      console.error("Failed to save product:", error);
      toast({
        title: 'Save Error',
        description: 'Could not save the product. Your browser might be in private mode.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
            <CheckCircle className="w-6 h-6 text-primary"/>
            Your Product Listing is Ready!
        </CardTitle>
        <CardDescription>
          Review and edit the AI-generated details below. When you're happy with it, save the product.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Handcrafted Wooden Bowl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Home & Kitchen" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹</span>
                      <Input type="number" placeholder="e.g. 2499" className="pl-7" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your product..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. handmade, eco-friendly, kitchenware" {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated keywords for better search visibility.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="submit" className="w-full sm:w-auto">
                <CheckCircle className="mr-2 h-4 w-4" />
                Save Product
              </Button>
              <Button type="button" variant="outline" onClick={onRestart} className="w-full sm:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" />
                Start Over
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
