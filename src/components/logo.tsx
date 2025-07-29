export const Logo = () => {
  return (
    <div className="flex flex-row space-x-4 tracking-wide uppercase">
      <div className="flex w-full items-center justify-center text-center">
        <span className="text-muted font-open-sans rounded-xl bg-amber-800 p-6 py-4 text-7xl">D</span>
      </div>

      <div className="font-open-sans flex flex-col space-y-0 text-3xl font-medium tracking-wide text-amber-800">
        <span>Dynamic</span>
        <span>Form</span>
        <span>Builder</span>
      </div>
    </div>
  );
};
