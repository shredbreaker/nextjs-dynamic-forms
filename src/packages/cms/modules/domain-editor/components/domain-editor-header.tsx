/**
 * @fileoverview Domain Editor Header - Main header bar for domain editor
 *
 * 🎯 PURPOSE: Provides top header bar with domain controls and editor tools
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Horizontal header layout with three-column grid
 * - Domain input and reset controls on left
 * - Central property toolbar for editor controls
 * - User settings and save controls on right
 *
 * 🤖 AI GUIDANCE - Domain Editor Header Usage:
 * ✅ USE as main header in domain layout
 * ✅ PROVIDE domain name input and controls
 * ✅ INTEGRATE property toolbar for editor controls
 * ✅ INCLUDE user settings and save functionality
 *
 * ❌ NEVER use for navigation sidebar (use PropertyNavigation)
 * ❌ NEVER skip domain input controls
 * ❌ NEVER hardcode header dimensions (use responsive grid)
 *
 * 🎨 LAYOUT STRUCTURE:
 * - Left: Domain input, reset button
 * - Center: Property toolbar with editor controls
 * - Right: Locale switcher, theme switcher, save button
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

import { memo } from "react";
import { ThemeSwitcher } from "@shared-ui/components/theme/theme-switcher";
import LocaleSwitcher from "@shared-ui/i18n/locale-switcher";
import { DomainNameInput } from "@cms/modules/domain-editor/features/domain-config";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { CanvasStoreHydrated, useLayoutStore } from "@cms/modules/domain-editor/stores";
import { DomainStoreHydrated } from "@cms/modules/domain-editor/stores/domain-store/domain.store.hooks";
import { CanvasToolbar } from "@cms/modules/domain-editor/toolbar/canvas-toolbar";
import { LanguageSelectionBar } from "@cms/modules/domain-editor/toolbar/language-selection-bar";
import { ResetButton } from "./ui";

/**
 * 🎛️ Domain Editor Header - Main header bar with controls
 *
 * Provides the main header bar for the domain editor with domain controls,
 * property toolbar, and user settings. Uses a three-column grid layout
 * for responsive design and proper control organization.
 *
 * Features:
 * - Domain name input and reset controls
 * - Central property toolbar with editor controls
 * - User settings (locale, theme, save)
 * - Responsive three-column grid layout
 *
 * @example
 * ```tsx
 * // In domain layout as sticky header
 * <div className="sticky top-0 z-50">
 *   <DomainEditorHeader />
 * </div>
 * ```
 */
export const DomainEditorHeader = memo(function DomainEditorHeader() {
  useDebugRender("DomainEditorHeader");

  const { setCurrentTranslation } = useLayoutStore().getState();

  return (
    <div className="bg-muted">
      {/* Top Bar */}
      <header className="flex w-full flex-row items-center justify-between px-6 pt-4">
        {/* Left Side */}
        <DomainStoreHydrated fallback={<div className="h-8 w-32 animate-pulse rounded" />}>
          <div className="flex flex-row items-center justify-start space-x-2 bg-amber-600">
            <DomainNameInput />
            <ResetButton />
          </div>
        </DomainStoreHydrated>

        {/* Right Side */}
        <div className="flex shrink-0 flex-row justify-end space-x-2">
          <LocaleSwitcher onSwitch={(locale) => setCurrentTranslation(locale)} />
          <ThemeSwitcher />
        </div>
        {/* Left Side */}
        {/* <div className="flex flex-row justify-start space-x-2"> */}
        {/* <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4 px-4">
          <div className="flex flex-row items-center justify-center space-x-4 justify-self-start">
            <DomainStoreHydrated fallback={<div className="h-8 w-32 animate-pulse rounded bg-gray-200" />}>
              <DomainNameInput />
            </DomainStoreHydrated>
            <CanvasStoreHydrated fallback={<div className="h-8 w-16 animate-pulse rounded bg-gray-200" />}>
              <ResetButton />
            </CanvasStoreHydrated>
          </div>

          <div className="justify-self-end">
            <div className="flex items-center space-x-3">
              <LocaleSwitcher />
              <ThemeSwitcher />
              <CanvasStoreHydrated fallback={<div className="h-8 w-24 animate-pulse rounded bg-gray-200" />}>
                <DomainStoreHydrated fallback={<div className="h-8 w-24 animate-pulse rounded bg-gray-200" />}>
                  <HeaderActionButtons />
                </DomainStoreHydrated>
              </CanvasStoreHydrated>
            </div>
          </div>
        </div> */}
      </header>
    </div>
  );
});

export default DomainEditorHeader;
