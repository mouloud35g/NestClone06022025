import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";
import QuickViewModal from "./QuickViewModal";
import { CartSheet } from "./CartSheet";
import { CheckoutDialog } from "./CheckoutDialog";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useProducts, Product } from "@/hooks/useProducts";
import { useCategories, Category } from "@/hooks/useCategories";

const Home = () => {
  const { categories } = useCategories();
  const formattedCategories = categories.map((category) => ({
    name: category.name,
    subcategories: category.subcategories?.map((sub) => sub.name) || [],
  }));
  const { products, loading, filterProducts } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { items: cartItems, addItem: addToCart } = useCart();
  const {
    items: wishlistItems,
    addItem: addToWishlist,
    hasItem: isInWishlist,
    removeItem: removeFromWishlist,
  } = useWishlist();

  const handleSearch = (query: string) => {
    filterProducts({ query });
  };

  const handleFavoriteClick = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      if (isInWishlist(id)) {
        removeFromWishlist(id);
      } else {
        addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        });
      }
    }
  };

  const handleQuickView = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setIsQuickViewOpen(true);
    }
  };

  const handleAddToCart = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
  };

  React.useEffect(() => {
    const handleToggleCart = () => setIsCartOpen((prev) => !prev);
    window.addEventListener("toggle-cart", handleToggleCart);
    return () => window.removeEventListener("toggle-cart", handleToggleCart);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onSearch={handleSearch}
        onCategorySelect={(category) => {
          setSelectedCategory(category);
          filterProducts({ category });
        }}
        favoritesCount={wishlistItems.length}
        cartItemCount={cartItems.length}
        categories={formattedCategories}
      />

      <div className="pt-[72px] flex">
        <FilterSidebar
          onPriceChange={(range) =>
            filterProducts({ minPrice: range[0], maxPrice: range[1] })
          }
          onCategoryChange={(category) => filterProducts({ category })}
          onColorChange={(color) => filterProducts({ color })}
          onAvailabilityChange={(inStock) => filterProducts({ inStock })}
        />

        <ProductGrid
          products={products}
          onFavoriteClick={handleFavoriteClick}
          onQuickView={handleQuickView}
        />
      </div>

      {selectedProduct && (
        <QuickViewModal
          open={isQuickViewOpen}
          onOpenChange={setIsQuickViewOpen}
          product={{
            ...selectedProduct,
            isFavorite: isInWishlist(selectedProduct.id),
          }}
          onFavoriteClick={handleFavoriteClick}
          onAddToCart={handleAddToCart}
        />
      )}

      <CartSheet
        open={isCartOpen}
        onOpenChange={(open) => {
          setIsCartOpen(open);
          if (!open) setIsCheckoutOpen(true);
        }}
      />
      <CheckoutDialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen} />
    </div>
  );
};

export default Home;
