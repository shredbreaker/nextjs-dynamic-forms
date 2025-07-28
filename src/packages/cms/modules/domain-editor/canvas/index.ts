/**
 * @fileoverview Canvas Module - Property editing workspace components
 *
 * 🎯 PURPOSE: Main property editing canvas components
 *
 * This module contains the tightly-coupled canvas components that form
 * the main property editing interface:
 * - PropertyCanvas: Main workspace component
 * - PropertyEditorCardList: Scrollable list of properties
 * - PropertyEditorCardRow: Individual property editing row
 *
 * 🏗️ ARCHITECTURE: These components are co-located because they form
 * a tight composition hierarchy and share canvas-specific concerns.
 */

export { default as PropertyCanvas } from "./property-canvas";
export { PropertyEditorCardList } from "./property-editor-list";
export { PropertyEditorCardRow } from "./property-editor-row";
