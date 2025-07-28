"use client";

import {
  usePropertyTextInputUncontrolled,
  usePropertyTextInputControlled,
  usePropertyTextDisplay,
} from "./utils/use-text";

export function usePropertyCodeDisplay(): string | undefined {
  return usePropertyTextDisplay("code");
}

export function usePropertyCodeInputUncontrolled(variant?: string): {
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputId: string;
  defaultValue: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
} {
  return usePropertyTextInputUncontrolled("code", variant);
}

export function usePropertyCodeInputControlled(variant?: string): {
  inputId: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
} {
  return usePropertyTextInputControlled("code", variant);
}
