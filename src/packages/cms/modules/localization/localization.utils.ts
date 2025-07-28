/**
 * Extract localized text from FormData using bracket notation (e.g., name[en], name[th])
 * Used by forms that send data as name[en], name[th], etc.
 */
export function localizedTextFromBrackets(
  formObject: Record<string, FormDataEntryValue>,
  prefix: string,
): Record<string, string> {
  const text: Record<string, string> = {};

  // Match keys like "name[en]", "name[th]", etc.
  const regex = new RegExp(`^${prefix}\\[(.+)\\]$`);

  Object.keys(formObject).forEach((key) => {
    const match = key.match(regex);
    if (match) {
      const lang = match[1];
      text[lang] = formObject[key].toString();
    }
  });

  return text;
}
