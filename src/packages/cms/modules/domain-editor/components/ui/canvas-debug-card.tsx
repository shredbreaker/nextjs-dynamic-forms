import { ClientOnly } from "@shared-ui/components/client-only";
import { DebugCard } from "@shared-ui/components/ui/debug-json-card";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";

export default function CanvasDebugCard() {
  const properties = useCanvasStore()((state) => state.properties);
  return (
    <ClientOnly>
      <DebugCard json={properties} />
    </ClientOnly>
  );
}
