/**
 * Removes dashes from a string type.
 */
export type RemoveDashes<S extends string> = S extends `${infer L}-${infer R}`
  ? `${L}${R}`
  : S;

/**
 * Converts a string type to camel case.
 *
 * @example
 * ```ts
 * type Test = CamelCase<'default-src'>; // 'defaultSrc'
 * ```
 */
type CamelCase<S extends string> = S extends `${infer L}-${infer R}`
  ? `${Lowercase<L>}${Capitalize<CamelCase<R>>}`
  : S;

type RemoveQuotes<S extends string> = S extends `'${infer R}'` ? R
  : S;

/**
 * Removes `'`'s from a string type, removes dashes, and converts to camel case.
 *
 * @example
 * ```ts
 * type Test = ConfigKey<"'default-src'">; // 'defaultSrc'
 * ```
 */
export type ConfigKey<S extends string> = CamelCase<
  RemoveQuotes<S>
>;

export type RemoveEndingColon<S extends string> = S extends `${infer R}:` ? R
  : S;
