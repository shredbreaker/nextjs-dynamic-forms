// https://shadcnui-expansions.typeart.cc/docs/floating-label-input
import * as React from "react";
import { cn } from "@shared-ui/lib/utils";
import { Input } from "./input";
import { Label } from "./label";

const FloatingInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        placeholder=" "
        className={cn("peer bt-1 rounded-none border-0 border-b-1 px-0 shadow-none", className)}
        ref={ref}
        {...props}
      />
    );
  },
);
FloatingInput.displayName = "FloatingInput";

const FloatingLabel = React.forwardRef<React.ComponentRef<typeof Label>, React.ComponentPropsWithoutRef<typeof Label>>(
  ({ className, ...props }, ref) => {
    return (
      <Label
        className={cn(
          "peer-focus:secondary peer-focus:dark:secondary absolute start-2 top-2 z-10 origin-[0] -translate-y-2.5 scale-75 transform cursor-text truncate bg-transparent px-0 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-2.5 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:px-0 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:bg-transparent",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
FloatingLabel.displayName = "FloatingLabel";

type FloatingLabelInputProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };

const FloatingLabelInput = React.forwardRef<
  React.ComponentRef<typeof FloatingInput>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, ...props }, ref) => {
  return (
    <div className="relative">
      <FloatingInput ref={ref} id={id} {...props} />
      <FloatingLabel htmlFor={id}>{label}</FloatingLabel>
    </div>
  );
});
FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingInput, FloatingLabel, FloatingLabelInput };
