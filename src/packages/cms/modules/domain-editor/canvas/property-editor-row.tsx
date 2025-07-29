import { memo, useContext } from "react";
import { cn } from "@shared-ui/lib/utils";
import { ReactiveDebugCard } from "@cms/modules/domain-editor/components/reactive-debug-card";
import { PropertyRowContext } from "@cms/modules/domain-editor/contexts";
import { PropertyEditorCard } from "@cms/modules/domain-editor/features/property-editing";
import { PropertyPreview } from "@cms/modules/domain-editor/features/property-previews";
import { useDebugRender } from "@cms/modules/domain-editor/hooks";
import { useLayoutStore } from "@cms/modules/domain-editor/stores/layout-store/layout.store.hooks";
import { PropertyValueProvider } from "@cms/modules/values/contexts/property-value.context";
import { ValueInputMode } from "@cms/modules/values/types/value-input.types";

export const PropertyEditorCardRow = memo(() => {
  useDebugRender("PropertyEditorCardRow");
  const store = useLayoutStore();
  const showPreview = store((state) => state.showPreview);
  const showDebugCard = store((state) => state.showDebugCard);

  return (
    <div
      className={cn(
        "grid items-start gap-4 pt-2 sm:gap-10",
        showPreview || showDebugCard ? "sm:grid-cols-2" : "sm:grid-cols-1",
      )}
    >
      <div className="flex items-center justify-center">
        <div className={cn("w-full px-0 sm:max-w-md")}>
          <PropertyEditorCard />
        </div>
      </div>

      {showPreview && (
        <div className="relative z-20 flex items-center justify-center bg-transparent">
          <div className="w-full bg-transparent">
            <PropertyPreview />
          </div>
        </div>
      )}

      {showDebugCard && (
        <div className="relative z-20 flex items-center justify-center bg-transparent">
          <div className="w-full bg-transparent">
            <PropertyPreviewCard />
          </div>
        </div>
      )}
    </div>
  );
});

PropertyEditorCardRow.displayName = "PropertyEditorCardRow";

const PropertyPreviewCard = memo(() => {
  const { propertyId } = useContext(PropertyRowContext)!;
  return (
    <PropertyValueProvider propertyId={propertyId} value={null} mode={ValueInputMode.PREVIEW}>
      <ReactiveDebugCard />
    </PropertyValueProvider>
  );
});

PropertyPreviewCard.displayName = "PropertyPreviewCard";
