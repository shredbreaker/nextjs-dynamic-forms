import type { Property } from "@cms/modules/properties/property.types";

export type FormProperty = Omit<Property, "display_order" | "options">;
