import { LoaderCircle } from "lucide-react";
import { Logo } from "./logo";

export function Loader() {
  return (
    <div className="bg-muted flex h-dvh w-full flex-col items-center justify-start space-y-8 p-8">
      <div className="animate-pulse">
        <Logo />
      </div>
      <LoaderCircle className="h-10 w-10 animate-spin text-amber-800" />
    </div>
  );
}
