import React from "react";
import { ThemeSwitcher } from "@shared-ui/components/theme/theme-switcher";
import LocaleSwitcher from "@shared-ui/i18n/locale-switcher";
import { Logo } from "./logo";
const Header = () => {
  return (
    <header className="bg-muted ba-muted text-muted-foreground w-full">
      <div className="mx-auto max-w-7xl px-4 py-4">
        {/* Main Header Content */}
        <div className="grid grid-cols-1 items-center space-x-0 lg:grid-cols-2">
          {/* Social Links */}
          <Logo />

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
