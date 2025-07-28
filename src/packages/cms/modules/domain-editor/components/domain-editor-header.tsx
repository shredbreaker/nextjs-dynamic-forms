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
 * - Center: Property toolbar for editor controls
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
import { useLayoutStore } from "@cms/modules/domain-editor/stores";
import { DomainStoreHydrated } from "@cms/modules/domain-editor/stores/domain-store/domain.store.hooks";
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
        {/* Left Side - Domain Name and Reset Button */}
        <DomainStoreHydrated fallback={<div className="h-8 w-32 animate-pulse rounded" />}>
          <div className="flex min-w-0 flex-1 flex-row items-center space-x-2">
            <div className="flex min-w-0 flex-1 flex-row items-center space-x-2">
              <DomainNameInput />
              <ResetButton />
            </div>
          </div>
        </DomainStoreHydrated>

        {/* Right Side - Controls (Always Visible) */}
        <div className="flex shrink-0 flex-row justify-end space-x-2">
          <LocaleSwitcher onSwitch={(locale) => setCurrentTranslation(locale)} />
          <ThemeSwitcher />
        </div>
      </header>
    </div>
  );
});

export default DomainEditorHeader;
