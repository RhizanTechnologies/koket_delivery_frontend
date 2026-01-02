import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CategoryFormProps {
  onSubmit: (name: string) => void;
  placeholder?: string;
  buttonText?: string;
  initialValue?: string;
  onCancel?: () => void;
}

export default function CategoryForm({
  onSubmit,
  placeholder = "Enter category name",
  buttonText = "Add Category",
  initialValue = "",
  onCancel,
}: CategoryFormProps) {
  const [name, setName] = useState(initialValue);

  // Sync state if initialValue changes (modal reused)
  useEffect(() => {
    setName(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6"
    >
      <div className="relative flex-1">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-border rounded-md pl-3 sm:pl-4 pr-10 py-2 sm:py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent"
          required
        />
        {onCancel && name && (
          <button
            type="button"
            onClick={() => setName("")}
            className="absolute right-9 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors border-r pr-2"
            title="Clear input"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {onCancel && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCancel();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-red-500 p-1 transition-colors"
            title="Cancel"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <Button
        type="submit"
        className="px-4 sm:px-6 py-2 text-sm w-full sm:w-auto min-w-[120px]"
      >
        {buttonText}
      </Button>
    </form>
  );
}
