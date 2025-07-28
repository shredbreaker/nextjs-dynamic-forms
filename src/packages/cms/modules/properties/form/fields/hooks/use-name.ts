"use client";

import {
  usePropertyLocaleTextDisplay,
  usePropertyLocaleTextInputControlled,
  usePropertyLocaleTextInputUncontrolled,
} from "./utils/use-locale-text";

export function usePropertyNameDisplay(): string | undefined {
  return usePropertyLocaleTextDisplay("name");
}

export function usePropertyNameInputControlled(variant = ""): {
  inputId: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
} {
  return usePropertyLocaleTextInputControlled("name", variant);
}

export function usePropertyNameInputUncontrolled(variant = ""): {
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputId: string;
  defaultValue: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
} {
  return usePropertyLocaleTextInputUncontrolled("name", variant);
}
