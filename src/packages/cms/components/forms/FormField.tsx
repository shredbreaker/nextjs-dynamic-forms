"use client";

import React from "react";
import { cn } from "@shared-ui/lib/utils";

export interface FormFieldProps {
  /** Field title/label */
  title?: string;
  /** Field description text */
  description?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Input component */
  children: React.ReactNode;
  /** Additional container styling */
  className?: string;
  /** HTML ID for the field (for accessibility) */
  id?: string;
}

/**
 * FormField - Generic form field wrapper component
 *
 * Provides consistent layout and styling for form fields across the application.
 * This is a truly shared component that can be used by any form, regardless of domain.
 *
 * Features:
 * - Consistent field layout
 * - Required field indicators
 * - Description text support
 * - Accessible label associations
 * - Customizable styling
 */
export function FormField({
  title,
  description,
  required = false,
  children,
  className,
  id,
}: FormFieldProps): React.JSX.Element {
  return (
    <div className={cn("space-y-2", className)}>
      {/* Field Title */}
      {title && (
        <div className="space-y-1">
          <label
            htmlFor={id}
            className={cn(
              "text-sm leading-none font-medium",
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
      )}

      {/* Input Area */}
      <div className="space-y-1">{children}</div>

      {/* Description */}
      {description && <p className={cn("text-sm text-gray-600", "leading-relaxed")}>{description}</p>}
    </div>
  );
}
