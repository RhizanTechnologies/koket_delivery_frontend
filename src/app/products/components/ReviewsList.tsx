import { useState } from "react";
import { Star, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  onEdit?: (review: ProductReview) => void;
  onDelete?: (reviewId: string) => void;
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
  onEdit,
  onDelete,
}: ReviewsListProps) {
  const list = reviews ?? [];
  const [showAll, setShowAll] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Sort reviews to show current user's review first
  const sortedList = [...list].sort((a, b) => {
    const aUserId = typeof a.user_id === "string" ? a.user_id : a.user_id?._id;
    const bUserId = typeof b.user_id === "string" ? b.user_id : b.user_id?._id;

    const aIsCurrentUser = currentUserId && aUserId === currentUserId;
    const bIsCurrentUser = currentUserId && bUserId === currentUserId;

    if (aIsCurrentUser && !bIsCurrentUser) return -1;
    if (!aIsCurrentUser && bIsCurrentUser) return 1;
    return 0;
  });

  // Show only 3 reviews initially, or all if showAll is true
  const displayedReviews = showAll ? sortedList : sortedList.slice(0, 3);
  const hasMore = sortedList.length > 3;

  return (
    <div className="relative">
      <div className="mt-6 space-y-4">
        {sortedList.length === 0 ? (
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

              // Check if this review belongs to the current user
              const reviewUserId =
                typeof review.user_id === "string"
                  ? review.user_id
                  : review.user_id?._id;
              const isCurrentUser =
                currentUserId && reviewUserId === currentUserId;

              return (
                <Card
                  key={review._id}
                  className="rounded-lg border border-border p-6 relative"
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
                      <div className="flex items-center gap-3">
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
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-xs leading-relaxed text-foreground md:text-sm">
                        {review.comment}
                      </p>
                    )}
                    {isCurrentUser && (onEdit || onDelete) && (
                      <div className="flex gap-2 justify-end mt-2">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(review)}
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            title="Edit review"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteConfirmId(review._id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            title="Delete review"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}

            <AlertDialog
              open={deleteConfirmId !== null}
              onOpenChange={(open) => !open && setDeleteConfirmId(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Review</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this review? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteConfirmId(null)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      if (deleteConfirmId) {
                        onDelete?.(deleteConfirmId);
                        setDeleteConfirmId(null);
                      }
                    }}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    Delete
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
