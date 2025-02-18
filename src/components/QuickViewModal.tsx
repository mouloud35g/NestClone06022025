import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface QuickViewModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  product?: {
    id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    rating: number;
    review_count: number;
    isFavorite: boolean;
  };
  onAddToCart?: (id: string) => void;
  onFavoriteClick?: (id: string) => void;
}

const QuickViewModal = ({
  open = true,
  onOpenChange = () => {},
  product = {
    id: "1",
    name: "Modern Lounge Chair",
    price: 299.99,
    description:
      "A comfortable and stylish lounge chair perfect for any modern living space. Features premium materials and ergonomic design.",
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&q=80",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80",
    ],
    rating: 4.5,
    review_count: 0,
    isFavorite: false,
  },
  onAddToCart = () => {},
  onFavoriteClick = () => {},
}: QuickViewModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "w-20 h-20 rounded-md overflow-hidden",
                    currentImageIndex === index ? "ring-2 ring-primary" : "",
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({product.review_count})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-2xl font-bold">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">
                      {product.rating}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onFavoriteClick(product.id)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <Heart
                    className={cn(
                      "w-6 h-6",
                      product.isFavorite
                        ? "fill-red-500 stroke-red-500"
                        : "stroke-gray-600",
                    )}
                  />
                </button>
              </div>

              <p className="text-gray-600">{product.description}</p>

              <Button
                size="lg"
                className="w-full"
                onClick={() => onAddToCart(product.id)}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-6 h-6 fill-yellow-400 stroke-yellow-400" />
                  <span className="text-lg font-semibold">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.review_count}{" "}
                  {product.review_count === 1 ? "review" : "reviews"}
                </span>
              </div>

              <ReviewList productId={product.id} />

              {useAuth().user ? (
                <div className="pt-6 border-t">
                  <h3 className="font-medium mb-4">Write a Review</h3>
                  <ReviewForm productId={product.id} />
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  Please sign in to write a review
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
