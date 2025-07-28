/**
 * @fileoverview Property Option Badge Add Field
 *
 * 🎯 PURPOSE: Badge-style add field for creating new property options
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Based on existing PropertyOptionAddItem component pattern
 * - Badge-style design that matches existing option badges
 * - Enter key support for quick option creation
 * - Auto-focus and clear field behavior after creation
 * - Integration with usePropertyOptionCRUD for option creation
 * - Dynamic width with max-width constraints matching option badges
 *
 * 🎨 UX IMPROVEMENTS (Phase 1.1):
 * - Dynamic width: min-w-[120px] for usable input area
 * - Max-width constraint: max-w-[200px] matching option badges
 * - Consistent styling: matches option badge appearance
 * - Proper spacing: consistent with other badges in vertical layout
 *
 * 🤖 AI GUIDANCE - Badge Add Field Usage:
 * ✅ USE for badge-style option creation interface
 * ✅ CONSISTENT styling with existing badge components
 * ✅ KEYBOARD support for efficient option creation
 * ✅ AUTO-FOCUS and clear field after successful creation
 * ✅ DYNAMIC sizing matching option badges
 *
 * ❌ NEVER create options without user input validation
 * ❌ NEVER bypass usePropertyOptionCRUD for option creation
 * ❌ NEVER break existing keyboard navigation patterns
 * ❌ NEVER make add field too small for comfortable typing
 *
 * 🔄 ADD OPTION FLOW:
 * 1. User clicks or focuses on add field
 * 2. User types option name (with proper input width)
 * 3. User presses Enter key
 * 4. New option created via usePropertyOptionCRUD with user-typed name
 * 5. Field auto-clears and refocuses for next option
 * 6. Field shows placeholder text when empty
 *
 * 📚 REFERENCE: Based on PropertyOptionAddItem pattern + improved badge styling
 */
"use client";

import { Plus } from "lucide-react";
import { memo, useCallback, useRef, useState, KeyboardEvent } from "react";
import { Badge } from "@shared-ui/shadcn/components/ui/badge";
import { Input } from "@shared-ui/shadcn/components/ui/input";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { usePropertyOptionCRUD } from "@cms/modules/domain-editor/features/property-editing";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store";

/**
 * 🆕 Property Option Badge Add Field
 *
 * Badge-style input field for creating new property options.
 * Provides quick option creation with Enter key support and auto-clear functionality.
 *
 * Features:
 * - Dynamic badge width with min/max-width constraints for usability
 * - Badge styling consistent with existing option badges
 * - Placeholder text indicating add functionality
 * - Enter key creates option and clears field
 * - Auto-focus on field clear for continuous option creation
 * - Plus icon visual indicator
 * - Integration with usePropertyOptionCRUD hook
 * - Automatically sets option name to user input
 * - Responsive sizing for vertical layout
 *
 * @param propertyId - ID of the property to add options to
 *
 * @example
 * ```tsx
 * <PropertyOptionBadgeAddField propertyId="prop-123" />
 * ```
 */
export const PropertyOptionBadgeAddField = memo(function PropertyOptionBadgeAddField({
  propertyId,
}: {
  propertyId: string;
}) {
  useDebugRender("PropertyOptionBadgeAddField");
  const { t } = useCMSTranslations();

  const [optionName, setOptionName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { addPropertyOption, updateOptionName } = usePropertyOptionCRUD(propertyId);
  const canvasStore = useCanvasStore();
  const layoutStore = useLayoutStore();
  const currentTranslation = layoutStore((state) => state.currentTranslation);

  /**
   * 🎯 Handle Option Creation
   *
   * Creates new option with user-typed name, then clears field and refocuses
   * for continuous option creation workflow.
   */
  const handleAddOption = useCallback(async () => {
    const trimmedName = optionName.trim();

    // Only create option if user entered something
    if (trimmedName.length > 0) {
      // Create the option first
      addPropertyOption();

      // Get the new option ID (it will be the last option created)
      // We need to wait a bit for the option to be created, then update its name
      setTimeout(() => {
        // Find the most recently created option (has is_new: true and highest display_order)
        const store = canvasStore.getState();
        const options = Object.values(store.propertyOptions?.[propertyId] || {});
        const newOption = options
          .filter((opt) => opt.is_new)
          .sort((a, b) => (b.display_order || 0) - (a.display_order || 0))[0];

        if (newOption) {
          updateOptionName(newOption.option_id, currentTranslation, trimmedName);
        }
      }, 50); // Small delay to ensure option is created

      setOptionName(""); // Clear field

      // Refocus input for continuous option creation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [optionName, addPropertyOption, updateOptionName, propertyId, currentTranslation, canvasStore]);

  /**
   * 🎹 Handle Keyboard Input
   *
   * Enter key creates option, Escape clears field.
   * Follows existing keyboard interaction patterns.
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleAddOption();
      } else if (event.key === "Escape") {
        event.preventDefault();
        setOptionName("");
        inputRef.current?.blur();
      }
    },
    [handleAddOption],
  );

  /**
   * 📝 Handle Input Change
   *
   * Updates local state with input value, applying character limits.
   */
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Apply same 255 character limit as existing options
    const trimmedValue = value.substring(0, 255);
    setOptionName(trimmedValue);
  }, []);

  return (
    <Badge
      variant="outline"
      className="border-muted hover:border-primary/50 flex h-auto w-fit max-w-[200px] min-w-[120px] items-center gap-1 border-dashed px-2 py-1 text-sm transition-colors"
      data-testid="property-option-badge-add-field"
    >
      <Plus className="text-muted-foreground h-3 w-3 shrink-0" />
      <Input
        ref={inputRef}
        type="text"
        value={optionName}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={t("property_options.manage_dialog.new_option_placeholder")}
        className="placeholder:text-muted-foreground/60 h-6 min-w-0 flex-1 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 dark:bg-transparent"
        data-testid="property-option-badge-add-input"
      />
    </Badge>
  );
});

PropertyOptionBadgeAddField.displayName = "PropertyOptionBadgeAddField";
