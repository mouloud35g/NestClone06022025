import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id?: string;
  name?: string;
  price?: number;
  rating?: number;
  review_count?: number;
  image?: string;
  isFavorite?: boolean;
  onFavoriteClick?: (id: string) => void;
  onQuickView?: (id: string) => void;
}

const ProductCard = ({
  id = "1",
  name = "Modern Lounge Chair",
  price = 299.99,
  rating = 4.5,
  review_count = 0,
  image = "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&q=80",
  isFavorite = false,
  onFavoriteClick = () => {},
  onQuickView = () => {},
}: ProductCardProps) => {
  return (
    <Card className="group relative w-72 bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={() => onFavoriteClick(id)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors duration-200",
              isFavorite ? "fill-red-500 stroke-red-500" : "stroke-gray-600",
            )}
          />
        </button>
      </div>

      <CardContent className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">
            ${price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600">
              {rating.toFixed(1)} ({review_count})
            </span>
          </div>
        </div>
        <Button
          variant="secondary"
          className="w-full mt-4"
          onClick={() => onQuickView(id)}
        >
          Quick View
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
