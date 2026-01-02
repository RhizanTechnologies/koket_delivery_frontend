"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { reviewSchema } from "@/app/schemas";
import { validateSafe } from "@/app/utils/validation";
import { toast } from "react-toastify";

interface ReviewFormProps {
  onSubmit: (payload: { rating: number; comment: string }) => void;
  defaultRating?: number;
  initialComment?: string;
  isSubmitting?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export function ReviewForm({
  onSubmit,
  defaultRating = 5,
  initialComment = "",
  isSubmitting = false,
  submitLabel = "Submit Review",
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(defaultRating);
  const [comment, setComment] = useState(initialComment);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRating(defaultRating);
  }, [defaultRating]);

  useEffect(() => {
    setComment(initialComment);
  }, [initialComment]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validate input data with Zod
    const validation = validateSafe(reviewSchema, { rating, comment });

    if (!validation.success) {
      setError(validation.error);
      toast.error(validation.error);
      return;
    }

    onSubmit(validation.data);
    if (!initialComment) {
      setComment("");
      setRating(defaultRating);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="mb-6 text-lg font-semibold">
        {initialComment ? "Edit Your Review" : "Write a Review"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setRating(star)}
                className="transition-colors p-0 h-auto w-auto"
                disabled={isSubmitting}
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground"
                  }`}
                />
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Review</label>
          <Textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Tell us about the cake, taste, delivery, design..."
            rows={4}
            required
            disabled={isSubmitting}
          />
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? "Submitting…" : submitLabel}
          </Button>
          {onCancel ? (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="border-border bg-transparent text-sm"
            >
              Cancel
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setComment("");
                setRating(defaultRating);
              }}
              disabled={isSubmitting}
              className="border-border bg-transparent text-sm"
            >
              Clear
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
