/**
 * Not useful math functions.
 *
 * This is an example module and should be removed before
 * committing the project.
 *
 * @module
 */

/**
 * Adds an arbitrary amount of numbers together.
 *
 * @returns The sum of all the numbers.
 *
 * @example Usage
 * ```ts
 * import { add } from '<% JSR_NAME %>/math';
 * import { assertEquals } from '@std/assert';
 *
 * const sum = add(1, 2, 3, 4, 5);
 * assertEquals(sum, 15);
 * ```
 */
export function add(...numbers: number[]): number {
  return numbers.reduce((sum, num) => sum + num, 0);
}
