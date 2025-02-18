import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  subcategories?: Category[];
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;

      // Organize categories into a tree structure
      const categoryMap = new Map<string, Category>();
      const rootCategories: Category[] = [];

      // First pass: Create category objects
      data?.forEach((category) => {
        categoryMap.set(category.id, { ...category, subcategories: [] });
      });

      // Second pass: Build the tree
      categoryMap.forEach((category) => {
        if (category.parent_id) {
          const parent = categoryMap.get(category.parent_id);
          parent?.subcategories?.push(category);
        } else {
          rootCategories.push(category);
        }
      });

      setCategories(rootCategories);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();

    // Subscribe to changes
    const subscription = supabase
      .channel("categories_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        fetchCategories,
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { categories, loading, error, refreshCategories: fetchCategories };
}
