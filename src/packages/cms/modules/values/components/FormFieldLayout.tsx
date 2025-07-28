"use client";

import React from "react";
import { cn } from "@shared-ui/lib/utils";

interface FormFieldLayoutProps {
  /** Field title/label */
  title: string;
  /** Field description text */
  description?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Input component */
  children: React.ReactNode;
  /** Additional container styling */
  className?: string;
}

/**
 * FormFieldLayout - Standard form field layout component
 *
 * Structure:
 * - Title with optional required indicator
 * - Input area (children)
 * - Description text
 *
 * Follows Shadcn form patterns for consistent styling
 */
export function FormFieldLayout({
  title,
  description,
  required = false,
  children,
  className,
}: FormFieldLayoutProps): React.JSX.Element {
  return (
    <div className={cn("space-y-2 bg-transparent p-2", className)}>
      {/* Field Title */}
      <div className="space-y-1 bg-transparent">
        <label
          className={cn(
            "text-muted-foreground text-sm leading-none font-medium",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          )}
        >
          {title}
          {required && (
            <span className="ml-1 text-red-500" aria-label="required">
              *
            </span>
          )}
        </label>
      </div>

      {/* Input Area */}
      <div className="space-y-1 bg-transparent">{children}</div>

      {/* Description */}
      {description && <p className={cn("text-sm text-gray-600", "leading-relaxed")}>{description}</p>}
    </div>
  );
}
