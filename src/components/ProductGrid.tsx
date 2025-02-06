import React from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  isFavorite: boolean;
}

interface ProductGridProps {
  products?: Product[];
  onFavoriteClick?: (id: string) => void;
  onQuickView?: (id: string) => void;
}

const ProductGrid = ({
  products = [
    {
      id: "1",
      name: "Modern Lounge Chair",
      price: 299.99,
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&q=80",
      isFavorite: false,
    },
    {
      id: "2",
      name: "Minimalist Desk Lamp",
      price: 89.99,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
      isFavorite: true,
    },
    {
      id: "3",
      name: "Wooden Coffee Table",
      price: 199.99,
      rating: 4.2,
      image:
        "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500&q=80",
      isFavorite: false,
    },
    {
      id: "4",
      name: "Ceramic Vase Set",
      price: 49.99,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&q=80",
      isFavorite: false,
    },
  ],
  onFavoriteClick = () => {},
  onQuickView = () => {},
}: ProductGridProps) => {
  return (
    <div className="bg-gray-50 p-6 w-full min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {products.map((product) => (
          <div key={product.id} className="flex justify-center">
            <ProductCard
              {...product}
              onFavoriteClick={onFavoriteClick}
              onQuickView={onQuickView}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
