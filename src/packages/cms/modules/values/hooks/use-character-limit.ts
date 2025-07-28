"use client";

import { useState, useCallback, ChangeEvent } from "react";

interface UseCharacterLimitProps {
  maxLength?: number;
  initialValue?: string;
}

interface UseCharacterLimitReturn {
  value: string;
  setValue: (value: string) => void;
  characterCount: number;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  maxLength?: number;
}

/**
 * Hook for managing text input with character limits
 *
 * Features:
 * - Character counting
 * - Max length enforcement
 * - Value state management
 *
 * @param maxLength Maximum allowed characters
 * @param initialValue Initial string value
 */
export function useCharacterLimit({ maxLength, initialValue = "" }: UseCharacterLimitProps): UseCharacterLimitReturn {
  const [value, setValue] = useState(initialValue);
  const characterCount = value.length;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (maxLength === undefined || newValue.length <= maxLength) {
        setValue(newValue);
      }
    },
    [maxLength],
  );

  return {
    value,
    setValue,
    characterCount,
    handleChange,
    maxLength,
  };
}
