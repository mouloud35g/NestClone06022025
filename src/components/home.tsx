import React, { useState } from "react";
import Navbar from "./Navbar";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";
import QuickViewModal from "./QuickViewModal";
import { CartSheet } from "./CartSheet.jsx";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

interface HomeProps {
  initialProducts?: Array<{
    id: string;
    name: string;
    price: number;
    rating: number;
    image: string;
    isFavorite: boolean;
    description?: string;
    images?: string[];
  }>;
}

const Home = ({
  initialProducts = [
    {
      id: "1",
      name: "Modern Lounge Chair",
      price: 299.99,
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&q=80",
      isFavorite: false,
      description:
        "A comfortable and stylish lounge chair perfect for any modern living space.",
      images: [
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&q=80",
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80",
      ],
    },
    {
      id: "2",
      name: "Minimalist Desk Lamp",
      price: 89.99,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
      isFavorite: true,
      description:
        "Modern desk lamp with adjustable arm and energy-efficient LED bulb.",
      images: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&q=80",
      ],
    },
    {
      id: "3",
      name: "Wooden Coffee Table",
      price: 199.99,
      rating: 4.2,
      image:
        "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500&q=80",
      isFavorite: false,
      description:
        "Solid wood coffee table with modern design and sturdy construction.",
      images: [
        "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500&q=80",
        "https://images.unsplash.com/photo-1565791380713-1756b9a05343?w=500&q=80",
      ],
    },
  ],
}: HomeProps) => {
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof initialProducts)[0] | null
  >(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items: cartItems, addItem: addToCart } = useCart();
  const {
    items: wishlistItems,
    addItem: addToWishlist,
    hasItem: isInWishlist,
    removeItem: removeFromWishlist,
  } = useWishlist();

  const handleSearch = (query: string) => {
    // Filter products based on search query
    const filtered = initialProducts.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()),
    );
    setProducts(filtered);
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
        favoritesCount={wishlistItems.length}
        cartItemCount={cartItems.length}
      />

      <div className="pt-[72px] flex">
        <FilterSidebar
          onPriceChange={(range) => console.log("Price range:", range)}
          onCategoryChange={(category) => console.log("Category:", category)}
          onColorChange={(color) => console.log("Color:", color)}
          onAvailabilityChange={(inStock) => console.log("In stock:", inStock)}
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

      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </div>
  );
};

export default Home;
