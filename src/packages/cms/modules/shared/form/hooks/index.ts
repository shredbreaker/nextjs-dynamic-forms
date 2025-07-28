/**
 * @fileoverview Shared Form Hooks - Export all form-related hooks
 *
 * 🎯 PURPOSE: Central export for all shared form hooks
 * - Generic reactive field hooks (work with any table/store)
 * - Property-specific adapters (maintain existing APIs)
 * - Ready for extension to other table modules (records, values, etc.)
 */

// Generic hooks (work with any store/table)
export {
  useReactiveField as useGenericReactiveField,
  type GenericStoreApi,
  type StoreSelector,
} from "./use-reactive-field";
