/**
 * @fileoverview Property Options Base Components - Export Index
 *
 * 🎯 PURPOSE: Consolidated exports for badge-style property options components
 *
 * 🏗️ ARCHITECTURE:
 * - PropertyOptionBadgeContainer: Main badge interface container
 * - PropertyOptionBadgeItemWithConfirmation: Individual option badge with delete confirmation
 * - PropertyOptionBadgeAddField: Add new option input field
 * - PropertyOptionCompactList: Compact list integrating badge container
 *
 * 🤖 AI GUIDANCE - Base Components Usage:
 * ✅ USE PropertyOptionBadgeContainer as main interface
 * ✅ INDIVIDUAL components available for custom layouts
 * ✅ CONSISTENT import pattern across codebase
 *
 * 📚 REFERENCE: Phase 1 implementation of property-options-management-plan.md
 */

// 🏷️ Main badge container (primary interface)
export { PropertyOptionBadgeContainer } from "./property-option-badge-container";

// 🎯 Individual badge components (for custom layouts)
export { PropertyOptionBadgeItemWithConfirmation } from "./property-option-badge-item-with-confirmation";
export { PropertyOptionBadgeAddField } from "./property-option-badge-add-field";

// 📋 Legacy and integration components
export { PropertyOptionCompactItem } from "./option-list/compact-item";
export { PropertyOptionCompactList } from "./option-list/compact-list";
