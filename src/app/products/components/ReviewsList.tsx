"use client";

import { useState, useMemo } from "react";
import { Star, Edit2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ProductReview } from "@/app/types/product";
import { ReviewForm } from "./ReviewForm";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ReviewsListProps {
  reviews?: ProductReview[];
  currentUserId?: string;
  onUpdate?: (reviewId: string, rating: number, comment: string) => Promise<void>;
  onDelete?: (reviewId: string) => Promise<void>;
}

const getInitials = (input?: string | any) => {
  if (!input || typeof input !== "string") return "?";
  const trimmed = input.trim();
  if (!trimmed) return "?";
  return (
    trimmed
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || "?"
  );
};

const formatDate = (date?: string) => {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export function ReviewsList({
  reviews,
  currentUserId,
  onUpdate,
  onDelete,
}: ReviewsListProps) {
  const [showAll, setShowAll] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Memoize the sorted list to put current user's review at top
  const list = useMemo(() => {
    if (!reviews) return [];
    if (!currentUserId) return reviews;

    return [...reviews].sort((a, b) => {
      const aOwnerId =
        typeof a.user_id === "object" ? a.user_id?._id || a.user_id?.id : a.user_id;
      const bOwnerId =
        typeof b.user_id === "object" ? b.user_id?._id || b.user_id?.id : b.user_id;

      if (aOwnerId === currentUserId) return -1;
      if (bOwnerId === currentUserId) return 1;
      return 0;
    });
  }, [reviews, currentUserId]);

  // Show only 5 reviews initially, or all if showAll is true
  const displayedReviews = showAll ? list : list.slice(0, 5);
  const hasMore = list.length > 5;

  const handleEdit = (reviewId: string) => {
    setEditingId(reviewId);
  };

  const confirmDelete = async () => {
    if (deletingId && onDelete) {
      setIsActionLoading(true);
      try {
        await onDelete(deletingId);
        setDeletingId(null);
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  const handleUpdate = async (rating: number, comment: string) => {
    if (editingId && onUpdate) {
      setIsActionLoading(true);
      try {
        await onUpdate(editingId, rating, comment);
        setEditingId(null);
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  return (
    <div className="relative">
      <div className="mt-6 space-y-4">
        {list.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              No reviews yet. Be the first to review! 🍰
            </p>
          </div>
        ) : (
          <>
            {displayedReviews.map((review: ProductReview) => {
              const ratingValue = Math.max(0, Math.min(5, review.rating ?? 0));
              // Handle user_id which can be string or object
              const ownerId =
                typeof review.user_id === "object"
                  ? review.user_id?._id || review.user_id?.id
                  : review.user_id;
              const isOwner = currentUserId && ownerId === currentUserId;

              const userName =
                typeof review.user_id === "object" && review.user_id?.name
                  ? review.user_id.name
                  : typeof review.user_id === "string"
                  ? review.user_id
                  : "Anonymous";
              const displayName = review.name ?? userName;
              const avatar = getInitials(displayName);
              const subtitle = formatDate(review.created_at);

              if (editingId === review._id) {
                return (
                  <div key={review._id} className="mt-4">
                    <ReviewForm
                      defaultRating={review.rating}
                      initialComment={review.comment}
                      onSubmit={(data) => handleUpdate(data.rating, data.comment)}
                      onCancel={() => setEditingId(null)}
                      isSubmitting={isActionLoading}
                      submitLabel="Update Review"
                    />
                  </div>
                );
              }

              return (
                <Card
                  key={review._id}
                  className="rounded-lg border border-border p-6"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                          {avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-primary">
                              {displayName}
                            </p>
                            {isOwner && (
                              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                You
                              </span>
                            )}
                          </div>
                          {subtitle && (
                            <p className="text-xs text-muted-foreground">
                              {subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`h-4 w-4 ${
                                index < ratingValue
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        {isOwner && (
                          <div className="flex items-center gap-2 border-l border-border pl-4 ml-2">
                            <button
                              onClick={() => handleEdit(review._id)}
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="Edit Review"
                              disabled={isActionLoading}
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeletingId(review._id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              title="Delete Review"
                              disabled={isActionLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-xs leading-relaxed text-foreground md:text-sm">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}

            {/* Deletion Confirmation Dialog */}
            <AlertDialog
              open={!!deletingId}
              onOpenChange={(open) => !open && setDeletingId(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    review for this product.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isActionLoading}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={confirmDelete}
                    disabled={isActionLoading}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isActionLoading ? "Deleting..." : "Delete Review"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Show More Button */}
            {hasMore && !showAll && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAll(true)}
                  className="border-primary/40 text-primary hover:bg-primary/10"
                >
                  Show More Reviews ({list.length - 5} more)
                </Button>
              </div>
            )}

            {/* Show Less Button */}
            {showAll && hasMore && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAll(false)}
                  className="border-primary/40 text-primary hover:bg-primary/10"
                >
                  Show Less
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
