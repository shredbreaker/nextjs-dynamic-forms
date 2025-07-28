/**
 * @fileoverview Header Action Buttons - Domain editor header actions
 *
 * 🎯 PURPOSE: Provides action buttons for domain editor header
 *
 * 🏗️ ARCHITECTURE DECISIONS:
 * - Connects to domain store for state management
 * - Provides discard, save, and publish buttons
 * - Handles confirmation dialogs for actions
 * - Shows different buttons based on domain state
 *
 * 🤖 AI GUIDANCE - Component Usage Rules:
 * ✅ USE in domain editor header
 * ✅ CONNECT to domain store for state
 * ✅ PROVIDE clear visual feedback
 * ✅ HANDLE confirmation dialogs
 *
 * ❌ NEVER mix domain and property concerns
 * ❌ NEVER use outside of domain editor context
 *
 * 📚 REFERENCE: See docs/architecture/domain-editor/hook-patterns.md
 */
"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shared-ui/shadcn/components/ui/alert-dialog";
import { Button } from "@shared-ui/shadcn/components/ui/button";
import { useCMSTranslations } from "@cms/i18n/use-cms-translation.hooks";
import { saveDomain } from "@cms/modules/domain-editor/actions";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { useDomainStore } from "@cms/modules/domain-editor/stores/domain-store";
import { SaveButton } from "./save-button";

/**
 * 🏗️ Header Action Buttons - Domain editor header actions
 *
 * Component that provides action buttons for the domain editor header.
 * Includes discard, save, and publish buttons with confirmation dialogs.
 */
export function HeaderActionButtons(): React.JSX.Element {
  const { t } = useCMSTranslations();
  const domainStore = useDomainStore();
  const canvasStore = useCanvasStore();

  const domain = domainStore((state) => state.domain);
  const canvasHasChanges = canvasStore((state) => state.hasChanged);

  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showUnpublishDialog, setShowUnpublishDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle publish domain
  const handlePublish = async () => {
    if (!domain) return;

    setIsPublishing(true);
    setError(null);

    try {
      // Update domain with is_active = true
      const publishedDomain = { ...domain, is_active: true };
      await saveDomain(publishedDomain);

      setShowPublishDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish domain");
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle unpublish domain
  const handleUnpublish = async () => {
    if (!domain) return;

    setIsUnpublishing(true);
    setError(null);

    try {
      // Update domain with is_active = false
      const unpublishedDomain = { ...domain, is_active: false };
      await saveDomain(unpublishedDomain);

      setShowUnpublishDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unpublish domain");
    } finally {
      setIsUnpublishing(false);
    }
  };

  if (!domain) return <></>;

  return (
    <div className="flex items-center space-x-2">
      {/* Property Save Button - For saving property schema changes */}
      <SaveButton />

      {/* Publish Button - Show when domain is not published */}
      {!domain.is_active && (
        <>
          <Button
            variant="default"
            onClick={() => setShowPublishDialog(true)}
            disabled={isPublishing || canvasHasChanges}
          >
            {isPublishing ? t("publishing") : t("publish")}
          </Button>

          <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("domain.publish.title")}</AlertDialogTitle>
                <AlertDialogDescription>{t("domain.publish.description")}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handlePublish}>{t("publish")}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {/* Unpublish Button - Show when domain is published */}
      {domain.is_active && (
        <>
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setShowUnpublishDialog(true)}
            disabled={isUnpublishing || canvasHasChanges}
          >
            {isUnpublishing ? t("unpublishing") : t("published")}
          </Button>

          <AlertDialog open={showUnpublishDialog} onOpenChange={setShowUnpublishDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("domain.unpublish.title")}</AlertDialogTitle>
                <AlertDialogDescription>{t("domain.unpublish.description")}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleUnpublish}>{t("unpublish")}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
