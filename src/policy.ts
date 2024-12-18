import { type Directive, sortDirectives } from './directive.ts';

/**
 * Provides a properly formatted CSP policy directive string.
 *
 * @param directive
 * @param values
 * @returns A formatted policy directive string that can be used in a CSP header.
 *
 * @example Usage
 * ```ts
 * import { formatPolicyDirective } from '@erictaylor/csp/policy';
 * import { FetchDirective } from '@erictaylor/csp/directive';
 * import { KeywordValue } from '@erictaylor/csp/value';
 * import { assertEquals } from '@std/assert';
 *
 * const policy = formatPolicyDirective(FetchDirective.DefaultSrc, KeywordValue.Self);
 *
 * assertEquals(policy, "default-src 'self'");
 * ```
 *
 * @example Complex Usage
 * ```ts
 * import { formatPolicyDirective } from '@erictaylor/csp/policy';
 * import { FetchDirective } from '@erictaylor/csp/directive';
 * import { KeywordValue, UnsafeKeywordValue } from '@erictaylor/csp/value';
 * import { assertEquals } from '@std/assert';
 *
 * const policy = formatPolicyDirective(
 *   FetchDirective.ScriptSrc,
 *   KeywordValue.Self,
 *   UnsafeKeywordValue.UnsafeInline,
 *   UnsafeKeywordValue.UnsafeEval,
 * );
 *
 * assertEquals(policy, "script-src 'self' 'unsafe-inline' 'unsafe-eval'");
 * ```
 */
export function formatPolicyDirective(
  directive: Directive,
  ...values: readonly string[]
): string {
  if (values.length === 0) {
    return directive;
  }

  return `${directive} ${values.map((value) => value.trim()).join(' ')}`;
}

/**
 * A tuple of a policy directive and its values.
 */
export type PolicyDirectiveTuple = readonly [
  directive: Directive,
  ...values: readonly string[],
];

/**
 * A list of policy directives.
 */
export type PolicyDirectiveList = readonly PolicyDirectiveTuple[];

/**
 * Provides a properly formatted policy directives.
 *
 * @param sort A directive sorting function. Defaults to {@linkcode sortDirectives}.
 * @param policies A list of policy directives and values.
 * @returns A formatted policy directives string that can be used in a CSP header.
 *
 * @example Custom sorting usage
 * ```ts
 * import { formatPolicyDirectiveList } from '@erictaylor/csp/policy';
 * import { FetchDirective } from '@erictaylor/csp/directive';
 * import { KeywordValue, UnsafeKeywordValue } from '@erictaylor/csp/value';
 * import { assertEquals } from '@std/assert';
 *
 * const policies = formatPolicyDirectiveList(
 *   // Reverse alphabetical sorting
 *   (a, b) => b.localeCompare(a),
 *   [FetchDirective.DefaultSrc, KeywordValue.Self],
 *   [FetchDirective.ScriptSrc, KeywordValue.Self, UnsafeKeywordValue.UnsafeInline],
 * );
 *
 * assertEquals(policies, "script-src 'self' 'unsafe-inline'; default-src 'self'");
 * ```
 */
export function formatPolicyDirectiveList(
  sort: (a: Directive, b: Directive) => number,
  ...policies: PolicyDirectiveList
): string;

/**
 * Provides a properly formatted policy directives.
 *
 * @param policies A list of policy directives and values.
 * @returns A formatted policy directives string that can be used in a CSP header.
 *
 * @example Simple usage
 * ```ts
 * import { formatPolicyDirectiveList } from '@erictaylor/csp/policy';
 * import { FetchDirective } from '@erictaylor/csp/directive';
 * import { KeywordValue, UnsafeKeywordValue } from '@erictaylor/csp/value';
 * import { assertEquals } from '@std/assert';
 *
 * const policies = formatPolicyDirectiveList(
 *   [FetchDirective.DefaultSrc, KeywordValue.Self],
 *   [FetchDirective.ScriptSrc, KeywordValue.Self, UnsafeKeywordValue.UnsafeInline],
 * );
 *
 * assertEquals(policies, "default-src 'self'; script-src 'self' 'unsafe-inline'");
 * ```
 */
export function formatPolicyDirectiveList(
  ...policies: PolicyDirectiveList
): string;

export function formatPolicyDirectiveList(
  sortOrPolicy:
    | ((a: Directive, b: Directive) => number)
    | PolicyDirectiveTuple,
  ...policies: PolicyDirectiveList
): string {
  if (typeof sortOrPolicy === 'function') {
    return [...policies]
      .sort(([a], [b]) => sortOrPolicy(a, b))
      .map(([directive, ...values]) =>
        formatPolicyDirective(directive, ...values)
      )
      .join('; ');
  }

  return formatPolicyDirectiveList(sortDirectives, sortOrPolicy, ...policies);
}
