import React from "react";
import ProductCard from "./ProductCard";

import { Product } from "@/hooks/useProducts";

interface ProductGridProps {
  products?: Product[];
  onFavoriteClick?: (id: string) => void;
  onQuickView?: (id: string) => void;
}

const ProductGrid = ({
  products = [],
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
