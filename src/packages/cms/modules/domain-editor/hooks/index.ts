// Hook exports - comprehensive barrel exports
export { useDebugRender } from "./use-debug-render";
export * from "./use-property";

// Hook aliases for backward compatibility during migration
export {
  useStaticProperty as usePropertyValue,
  useUncontrolledInput as usePropertyInput,
  useControlledInput as usePropertySyncedInput,
  useReactiveValue as usePropertySyncedValue,
} from "./use-property";
