import type { CommandCatalogItem, NumericParameter } from "../types/catalog";

/**
 * Per-order overrides for the numeric input limits reported by the backend
 * catalog. Keyed by field key (the keys of `CommandCatalogItem.fields`);
 * a `min`/`max` set here replaces the corresponding bound of the field's
 * safeRange, so the input min/max, placeholder, out-of-range validation and
 * error message all pick it up. `null` removes the bound; an omitted key
 * keeps the catalog value.
 */
export interface FieldLimitChanges {
  min?: number | null;
  max?: number | null;
}

export type OrderLimitOverride = [orderId: number, changes: Record<string, FieldLimitChanges>];

export const ORDER_LIMIT_OVERRIDES: readonly OrderLimitOverride[] = [
  [100, { propulsion_current_reference: { min: 0, max: 120 } }],
  [101, { levitation_target_height: { min: 5, max: 25 } }],
  [102, {
    propulsion_current_reference: { min: 0, max: 120 },
    levitation_target_height: { min: 5, max: 25 },
  }],
];

const overridesById = new Map(ORDER_LIMIT_OVERRIDES);

const overrideSafeRange = (param: NumericParameter, changes: FieldLimitChanges): NumericParameter => ({
  ...param,
  safeRange: [
    "min" in changes ? (changes.min ?? null) : param.safeRange[0],
    "max" in changes ? (changes.max ?? null) : param.safeRange[1],
  ],
});

/** Returns the item with ORDER_LIMIT_OVERRIDES applied to its numeric fields (the item itself if it has none). */
export const applyOrderLimitOverrides = (item: CommandCatalogItem): CommandCatalogItem => {
  const changes = overridesById.get(item.id);
  if (!changes) return item;

  const fields = Object.fromEntries(
    Object.entries(item.fields).map(([key, param]) => [
      key,
      param.kind === "numeric" && changes[key] ? overrideSafeRange(param, changes[key]) : param,
    ]),
  );

  return { ...item, fields };
};
