import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "./ui/scroll-area";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    email: string;
  };
}

interface ReviewListProps {
  productId: string;
}

export function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select(
            `
            id,
            rating,
            comment,
            created_at,
            user:user_id (email)
          `,
          )
          .eq("product_id", productId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReviews(data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();

    // Subscribe to new reviews
    const subscription = supabase
      .channel(`reviews:${productId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reviews",
          filter: `product_id=eq.${productId}`,
        },
        () => fetchReviews(),
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [productId]);

  if (loading) {
    return <div className="text-center">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center text-muted-foreground">No reviews yet</div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      className={`w-4 h-4 ${value <= review.rating ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <span className="text-sm font-medium">{review.user.email}</span>
            </div>
            <p className="text-sm text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
