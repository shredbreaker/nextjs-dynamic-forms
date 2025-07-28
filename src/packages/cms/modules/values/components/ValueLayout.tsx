"use client";

import React from "react";
import { cn } from "@shared-ui/lib/utils";

interface ValueLayoutProps {
  /** Field title/label */
  title?: string;
  /** Field description text */
  description?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Input component */
  children: React.ReactNode;
  /** Whether to use floating label */
  floatingLabel?: boolean;
  /** Additional container styling */
  className?: string;
}

/**
 * ValueLayout - Standard value field layout component
 *
 * Structure:
 * - Title with optional required indicator
 * - Input area (children)
 * - Description text
 *
 * Features:
 * - Optional floating label support
 * - Required field indicator
 * - Description text placement
 */
export function ValueLayout({
  title,
  description,
  required = false,
  children,
  floatingLabel = false,
  className,
}: ValueLayoutProps): React.JSX.Element {
  return (
    <div className={cn("space-y-2 bg-transparent", className)}>
      {/* Field Title - only shown if not using floating label */}
      {title && !floatingLabel && (
        <div className="space-y-1 bg-transparent">
          <label
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
      <div className="space-y-1 bg-transparent">{children}</div>

      {/* Description */}
      {description && <p className={cn("text-sm leading-relaxed text-gray-600")}>{description}</p>}
    </div>
  );
}
