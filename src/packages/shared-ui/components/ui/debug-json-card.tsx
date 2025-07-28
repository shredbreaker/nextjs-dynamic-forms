export function DebugCard({ json }: { json: string | null | object }) {
  return (
    <div className="bg-muted w-full max-w-md min-w-[90vw] sm:min-w-lg">
      <div className="h-full w-full overflow-auto rounded-md border p-3">
        <pre className="font-mono text-xs whitespace-pre-wrap">{JSON.stringify(json, null, 2)}</pre>
      </div>
    </div>
  );
}
