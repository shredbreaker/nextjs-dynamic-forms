"use client";

import {
  usePropertyLocaleTextInputControlled,
  usePropertyLocaleTextInputUncontrolled,
  usePropertyLocaleTextDisplay,
} from "./utils/use-locale-text";

export function usePropertyDescriptionDisplay(): string | undefined {
  return usePropertyLocaleTextDisplay("description");
}

export function usePropertyDescriptionInputControlled(variant = ""): {
  inputId: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
} {
  return usePropertyLocaleTextInputControlled("description", variant);
}

export function usePropertyDescriptionInputUncontrolled(variant = ""): {
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputId: string;
  defaultValue: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
} {
  return usePropertyLocaleTextInputUncontrolled("description", variant);
}
