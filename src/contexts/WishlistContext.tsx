import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";

type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type WishlistContextType = {
  items: WishlistItem[];
  addItem: (product: WishlistItem) => void;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);

  // Load wishlist from Supabase when user logs in
  useEffect(() => {
    if (user) {
      supabase
        .from("wishlists")
        .select("items")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.items) setItems(data.items);
        });
    } else {
      setItems([]); // Clear wishlist when user logs out
    }
  }, [user]);

  // Save wishlist to Supabase when it changes
  useEffect(() => {
    if (user) {
      supabase
        .from("wishlists")
        .upsert({
          user_id: user.id,
          items,
          updated_at: new Date().toISOString(),
        })
        .then();
    }
  }, [items, user]);

  const addItem = (product: WishlistItem) => {
    setItems((currentItems) => {
      if (!currentItems.find((item) => item.id === product.id)) {
        return [...currentItems, product];
      }
      return currentItems;
    });
  };

  const removeItem = (id: string) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };

  const hasItem = (id: string) => {
    return items.some((item) => item.id === id);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        hasItem,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export { WishlistProvider, useWishlist };
