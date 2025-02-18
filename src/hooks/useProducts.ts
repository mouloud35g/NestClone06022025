import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  images: string[];
  description: string;
  category: string;
  color: string;
  in_stock: boolean;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = async ({
    query,
    category,
    minPrice,
    maxPrice,
    color,
    inStock,
  }: {
    query?: string;
    category_id?: string;
    minPrice?: number;
    maxPrice?: number;
    color?: string;
    inStock?: boolean;
  }) => {
    try {
      setLoading(true);
      let queryBuilder = supabase.from("products").select("*");

      if (query) {
        queryBuilder = queryBuilder.ilike("name", `%${query}%`);
      }

      if (category_id) {
        queryBuilder = queryBuilder.eq("category_id", category_id);
      }

      if (minPrice !== undefined) {
        queryBuilder = queryBuilder.gte("price", minPrice);
      }

      if (maxPrice !== undefined) {
        queryBuilder = queryBuilder.lte("price", maxPrice);
      }

      if (color) {
        queryBuilder = queryBuilder.eq("color", color);
      }

      if (inStock !== undefined) {
        queryBuilder = queryBuilder.eq("in_stock", inStock);
      }

      const { data, error } = await queryBuilder.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    filterProducts,
    refreshProducts: fetchProducts,
  };
}
