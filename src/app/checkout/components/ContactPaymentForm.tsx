"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactPaymentFormProps {
  onSubmit?: (data: FormData) => void;
  isSubmitting?: boolean;
}

interface FormData {
  deliveryDate: string;
  recipientPhone: string;
  paymentProof: File | null;
}

export function ContactPaymentForm({
  onSubmit,
  isSubmitting = false,
}: ContactPaymentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    deliveryDate: "",
    recipientPhone: "",
    paymentProof: null,
  });

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, paymentProof: files[0] }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      paymentProof: file,
    }));

    // Reset AFTER state update to allow re-uploading the same file
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-2 border-border rounded-xl p-6 sm:p-8 bg-card shadow-lg"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        Payment & Contact Details
      </h2>

      <div className="space-y-6">
        {/* Payment Instructions - MOVED TO TOP */}
        <div className="bg-gradient-to-br from-primary/15 to-primary/5 border-2 border-primary/40 rounded-xl p-5 sm:p-6 shadow-md">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                Payment Instructions
              </h3>
              <p className="text-sm text-primary dark:text-primary font-medium">
                Please pay 30% of the total amount to confirm your order
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Bank Account */}
            <div className="bg-background rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-foreground">
                    Bank Account
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("1000680074554");
                    const btn = document.activeElement as HTMLButtonElement;
                    const originalText = btn.textContent;
                    btn.textContent = "Copied!";
                    setTimeout(() => {
                      btn.textContent = originalText;
                    }, 2000);
                  }}
                  className="text-xs font-medium px-3 py-1 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
                >
                  Copy
                </Button>
              </div>
              <div className="bg-muted rounded-md px-3 py-3 text-center">
                <span className="text-base sm:text-lg font-mono font-bold text-foreground">
                  1000680074554
                </span>
              </div>
            </div>

            {/* Mobile Payment */}
            <div className="bg-background rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-foreground">
                    Mobile Payment
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("0912700250");
                    const btn = document.activeElement as HTMLButtonElement;
                    const originalText = btn.textContent;
                    btn.textContent = "Copied!";
                    setTimeout(() => {
                      btn.textContent = originalText;
                    }, 2000);
                  }}
                  className="text-xs font-medium px-3 py-1 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
                >
                  Copy
                </Button>
              </div>
              <div className="bg-muted rounded-md px-3 py-3 text-center">
                <span className="text-base sm:text-lg font-mono font-bold text-foreground">
                0912700250
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-600 rounded-lg p-3">
            <svg
              className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-xs text-yellow-800 dark:text-yellow-200 leading-relaxed">
              <strong>Important:</strong> After making the payment, upload your
              payment proof below to confirm your order.
            </p>
          </div>
        </div>
        {/* Delivery Date */}
        <div>
          <label className="flex text-sm font-semibold text-foreground mb-2 items-center gap-2">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Desired Delivery Date *
          </label>
          <div className="relative">
            <Input
              type="date" 
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleInputChange}
              required
              min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
              className="w-full h-12 text-base pl-4 pr-4 cursor-pointer"
              placeholder="Select delivery date"
            />
          </div>
          <div className="flex items-start gap-2 mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
              <p className="font-semibold mb-1">📅 Delivery Information</p>
              <p>
                • Minimum delivery time: <strong>24 hours</strong> (next day)
                <br />
                • Please select when you'd like to receive your order
                <br />
                • For urgent same-day orders, call{" "}
                <a
                  href="tel:+251911334455"
                  className="text-primary hover:underline font-bold"
                >
                  +251 911 334 455
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Recipient Phone */}
        <div>
          <label className="flex text-sm font-semibold text-foreground mb-2 items-center gap-2">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Recipient Phone Number *
          </label>
          <Input
            type="tel"
            name="recipientPhone"
            value={formData.recipientPhone}
            onChange={handleInputChange}
            placeholder="+251 911334455"
            required
            className="w-full h-11"
          />
          <p className="text-xs text-muted-foreground mt-2">
            We'll contact you for order confirmation and delivery updates
          </p>
        </div>

        {/* Payment Proof Upload */}
        <div>
          <label className="flex text-sm font-semibold text-foreground mb-2 items-center gap-2">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Upload Payment Proof *
          </label>
          <p className="text-xs text-muted-foreground mb-3">
            Screenshot or photo of your payment receipt/confirmation
          </p>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive
                ? "border-primary bg-primary/10 scale-[1.02]"
                : formData.paymentProof
                ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
            }`}
          >
            <input
              type="file"
              id="payment-proof"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/jpg"
              required
              className="hidden"
            />
            <label htmlFor="payment-proof" className="cursor-pointer block">
              {formData.paymentProof ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                      ✓ File Uploaded Successfully
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-500 mt-1 truncate max-w-xs mx-auto">
                      {formData.paymentProof.name}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      setFormData((prev) => ({ ...prev, paymentProof: null }));
                      // Reset file input
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium h-auto p-0"
                  >
                    Remove & Upload Different File
                  </Button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG or JPEG (max 5MB)
                  </p>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Placing Order...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Confirm & Place Order
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4 leading-relaxed">
          By placing this order, you agree to our{" "}
          <a href="/terms" className="text-primary hover:underline">
            terms and conditions
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary hover:underline">
            privacy policy
          </a>
        </p>
      </div>
    </form>
  );
}
