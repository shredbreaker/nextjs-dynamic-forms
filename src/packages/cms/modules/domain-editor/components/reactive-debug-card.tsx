import { memo } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { DebugCard } from "@shared-ui/components/ui/debug-json-card";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";
import { usePropertyValue } from "@cms/modules/values/contexts/property-value.context";

export const ReactiveDebugCard = memo(function ReactiveDebugCard() {
  const store = useCanvasStore();

  const { currentProperty } = usePropertyValue();
  let debugOutput: Record<string, unknown> = { ...currentProperty };

  const options = useStore(
    store,
    useShallow((state) => state.propertyOptions),
  );

  if (currentProperty?.type === "option") {
    debugOutput = { ...debugOutput, options: options[currentProperty.id] || [] };
  }

  return <DebugCard json={debugOutput} />;
});
