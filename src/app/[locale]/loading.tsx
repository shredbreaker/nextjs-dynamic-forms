import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="bg-muted flex h-dvh w-full flex-col items-center justify-start space-y-8 p-8">
      <Logo />
      <LoaderCircle className="h-10 w-10 animate-spin" />
    </div>
  );
}

const Logo = () => {
  return (
    <div className="flex animate-pulse flex-row space-x-4 tracking-wide uppercase">
      <div className="flex w-full items-center justify-center text-center">
        <span className="text-muted font-open-sans rounded-xl bg-amber-800 p-6 py-4 text-7xl">D</span>
      </div>

      <div className="font-open-sans flex flex-col space-y-0 text-3xl font-medium tracking-wide">
        <span>Dynamic</span>
        <span>Form</span>
        <span>Builder</span>
      </div>
    </div>
  );
};
