import React from "react";
import { ThemeSwitcher } from "@shared-ui/components/theme/theme-switcher";
import LocaleSwitcher from "@shared-ui/i18n/locale-switcher";

const Header = () => {
  return (
    <header className="bg-muted ba-muted text-muted-foreground w-full">
      <div className="mx-auto max-w-7xl px-4 py-4">
        {/* Main Header Content */}
        <div className="grid grid-cols-1 items-center space-x-0 lg:grid-cols-2">
          {/* Brand Section */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-xl font-bold text-white shadow-lg">
              D
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold">Dynamic Form Builder</h3>
              <p className="text-sm">NextJS 15, Zustand, Immer, Zod, Tailwind and Shadcn</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex shrink-0 flex-row justify-end space-x-2">
            <LocaleSwitcher onSwitch={() => {}} />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
