import { useEditDomainContext } from "./edit-domain.context";

export const EditDomainToolbar = () => {
  const { isDevMode, setDevMode } = useEditDomainContext();
  return (
    <div className="w-fit rounded-md bg-zinc-200 px-4 py-2 ring-1 ring-slate-300">
      <button
        type="button"
        onClick={() => setDevMode(!isDevMode)}
        className={`${isDevMode ? "text-blue-600" : "text-zinc-700"}`}
      >
        <div className="flex flex-col items-center justify-center space-y-1 text-sm select-none">
          aa
          <span className="text-xs">Dev Mode</span>
        </div>
      </button>
    </div>
  );
};
