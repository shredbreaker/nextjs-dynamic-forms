import { MetaTitle, MetaDescription } from "@/app/meta";

export const Logo = () => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-xl font-bold text-white shadow-lg">
        D
      </div>
      <div className="flex flex-col">
        <h3 className="text-xl font-semibold">{MetaTitle}</h3>
        <p className="text-sm">{MetaDescription}</p>
      </div>
    </div>
  );
};
