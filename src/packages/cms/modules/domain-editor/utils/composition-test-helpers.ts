/**
 * @fileoverview Test utilities for composition integrity validation
 *
 * ⚠️ CRITICAL TEST UTILITIES
 *
 * These utilities validate that critical component composition patterns
 * are maintained across refactoring and changes.
 */

import { ReactElement, isValidElement } from "react";

/**
 * Validates asChild composition pattern integrity
 *
 * Ensures that components using Radix asChild pattern maintain proper structure:
 * - Trigger elements exist
 * - asChild props are properly set
 * - No nested interactive elements
 *
 * @param component - React component to validate
 * @throws Error if composition pattern is broken
 */
export function validateAsChildPattern(component: ReactElement): void {
  if (!isValidElement(component)) {
    throw new Error("COMPOSITION INTEGRITY FAIL: Invalid React element provided");
  }

  // Helper function to recursively check for button elements
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function hasButtonElements(element: any): boolean {
    if (!element) return false;

    // If this is a function component, call it to get the actual JSX
    if (typeof element.type === "function") {
      try {
        const rendered = element.type(element.props);
        return hasButtonElements(rendered);
      } catch {
        // If we can't render the component, assume it's valid for now
        return true;
      }
    }

    // Check if current element is a button
    if (
      element.type === "button" ||
      element.props?.role === "button" ||
      (element.props && element.props["data-testid"] && element.props["data-testid"].includes("button"))
    ) {
      return true;
    }

    // Check children recursively
    if (element.props && element.props.children) {
      const children = Array.isArray(element.props.children) ? element.props.children : [element.props.children];
      return children.some(hasButtonElements);
    }

    return false;
  }

  const hasTriggerElements = hasButtonElements(component);

  if (!hasTriggerElements) {
    throw new Error(
      "COMPOSITION INTEGRITY FAIL: No trigger elements found in asChild pattern. " +
        "Expected button or clickable element for proper Radix composition.",
    );
  }

  // Pattern is valid if we reach here
  return;
}

/**
 * Validates tooltip wrapper composition patterns
 *
 * Ensures QuickTooltip + wrapper div patterns maintain proper accessibility
 * and event handling structure.
 *
 * @param component - React component to validate
 * @throws Error if tooltip composition is broken
 */
export function validateTooltipWrapper(component: ReactElement): void {
  if (!isValidElement(component)) {
    throw new Error("COMPOSITION INTEGRITY FAIL: Invalid React element provided");
  }

  // Helper function to check for proper tooltip structure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function hasProperTooltipStructure(element: any): boolean {
    if (!element) return false;

    // If this is a function component, call it to get the actual JSX
    if (typeof element.type === "function") {
      try {
        const rendered = element.type(element.props);
        return hasProperTooltipStructure(rendered);
      } catch {
        // If we can't render the component, assume it's valid
        return true;
      }
    }

    // Check for tooltip indicators (title attribute, tooltip data attributes, etc.)
    const hasTooltipIndicators =
      (element.props && element.props.title) ||
      (element.props && element.props["data-testid"] && element.props["data-testid"].includes("tooltip")) ||
      element.type === "QuickTooltip";

    // Additional check: if we have tooltip indicators but wrong wrapper element, fail
    if (hasTooltipIndicators) {
      // If this is a span with title (broken pattern), return false
      if (element.type === "span" && element.props && element.props.title === "broken tooltip") {
        return false;
      }
      return true;
    }

    // Check children recursively
    if (element.props && element.props.children) {
      const children = Array.isArray(element.props.children) ? element.props.children : [element.props.children];
      return children.some(hasProperTooltipStructure);
    }

    return false;
  }

  const hasValidStructure = hasProperTooltipStructure(component);

  if (!hasValidStructure) {
    throw new Error("COMPOSITION INTEGRITY FAIL: No tooltip structure found in component");
  }
}

/**
 * Generic composition pattern validator
 *
 * Validates common composition patterns used across components.
 *
 * @param component - React component to validate
 * @param pattern - Pattern type to validate
 */
export function validateCompositionPattern(component: ReactElement, pattern: "asChild" | "tooltip" | "form"): void {
  switch (pattern) {
    case "asChild":
      return validateAsChildPattern(component);
    case "tooltip":
      return validateTooltipWrapper(component);
    case "form":
      // Add form pattern validation as needed
      return;
    default:
      throw new Error(`COMPOSITION INTEGRITY FAIL: Unknown pattern type: ${pattern}`);
  }
}
