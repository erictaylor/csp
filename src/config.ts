import type { HashAlgorithm } from './_constants.ts';
import { deepFreeze } from './_helpers.ts';
import {
  formatHashValue,
  formatNonceValue,
  KeywordValue,
  SchemeSourceValue,
  UnsafeKeywordValue,
} from './value.ts';

export interface PrimaryKeywordConfig {
  readonly inlineSpeculationRules?: boolean;
  readonly reportSample?: boolean;
  readonly self?: boolean;
  readonly strictDynamic?: boolean;
}

export interface UnsafeKeywordConfig {
  readonly unsafeEval?: boolean;
  readonly unsafeHashes?: boolean;
  readonly unsafeInline?: boolean;
  readonly wasmUnsafeEval?: boolean;
}

const UNSAFE_KEYWORD_MAP = deepFreeze<
  Record<keyof UnsafeKeywordConfig, UnsafeKeywordValue>
>({
  unsafeEval: UnsafeKeywordValue.UnsafeEval,
  unsafeHashes: UnsafeKeywordValue.UnsafeHashes,
  unsafeInline: UnsafeKeywordValue.UnsafeInline,
  wasmUnsafeEval: UnsafeKeywordValue.WasmUnsafeEval,
});

const isUnsafeKeyword = (key: string): key is keyof UnsafeKeywordConfig => {
  return key in UNSAFE_KEYWORD_MAP;
};

export interface SchemeKeywordConfig {
  readonly blob?: boolean;
  readonly data?: boolean;
  readonly filesystem?: boolean;
  readonly http?: boolean;
  readonly https?: boolean;
  readonly mediastream?: boolean;
  readonly ws?: boolean;
  readonly wss?: boolean;
}

const SCHEME_KEYWORD_MAP = deepFreeze<
  Record<keyof SchemeKeywordConfig, SchemeSourceValue>
>({
  blob: SchemeSourceValue.Blob,
  data: SchemeSourceValue.Data,
  filesystem: SchemeSourceValue.Filesystem,
  http: SchemeSourceValue.Http,
  https: SchemeSourceValue.Https,
  mediastream: SchemeSourceValue.Mediastream,
  ws: SchemeSourceValue.Websocket,
  wss: SchemeSourceValue.Wss,
});

const isSchemeKeyword = (key: string): key is keyof SchemeKeywordConfig => {
  return key in SCHEME_KEYWORD_MAP;
};

export interface KeywordConfig extends PrimaryKeywordConfig {
  readonly schema?: SchemeKeywordConfig;
  readonly unsafe?: UnsafeKeywordConfig;
}

export interface PolicyConfig extends KeywordConfig {
  readonly hashes?: ReadonlyArray<
    { readonly algorithm: HashAlgorithm; hash: string }
  >;
  readonly hosts?: ReadonlyArray<string>;
  readonly nonces?: ReadonlyArray<string>;
}

/**
 * Takes a given {@linkcode PolicyConfig} object and
 * converts it to a source expression list.
 *
 * The returned policy string is sorted in a custom order:
 * 1. `'self'` (if present)
 * 2. `'strict-dynamic'` (if present)
 * 3. `'inline-speculation-rules'` (if present)
 * 4. `'report-sample'` (if present)
 * 5. Unsafe Keywords (sorted alphabetically)
 * 6. Scheme Keywords (sorted alphabetically)
 * 7. Hosts (in order of appearance)
 * 8. Hashes (in order of appearance)
 * 9. Nonces (in order of appearance)
 *
 * Hashes and Nonces are formatted according to the CSP specification.
 * As an example, there is no need to include the `'nonce-'` prefix for nonces.
 *
 * @param config
 * @returns A sorted and formatted source express list string.
 *
 * @example
 * ```ts Usage
 * import { configToSourceExpressionList } from '@erictaylor/csp/config';
 * import { assertEquals } from '@std/assert';
 *
 * const policy = configToSourceExpressionList({
 *   self: true,
 *   unsafe: {
 *     unsafeHashes: true,
 *   },
 *   schema: {
 *     blob: true,
 *     data: false,
 *   },
 *   hashes: [
 *     { algorithm: 'SHA-256', hash: 'abc123' },
 *   ],
 *   nonces: ['abc123'],
 *   hosts: ['https://www.youtube.com'],
 * });
 *
 * assertEquals(
 *   policy,
 *   [
 *     "'self'",
 *     "'unsafe-hashes'",
 *     'blob:',
 *     'https://www.youtube.com',
 *     "'sha256-abc123'",
 *     "'nonce-abc123'",
 *   ].join(' '),
 */
export function configToSourceExpressionList({
  hashes = [],
  hosts = [],
  inlineSpeculationRules,
  nonces = [],
  reportSample,
  schema = {},
  self,
  strictDynamic,
  unsafe = {},
}: PolicyConfig): string {
  const policies: string[] = [];

  // 1. Add 'self' (if present)
  if (self) {
    policies.push(KeywordValue.Self);
  }

  // 2. Add 'strict-dynamic' (if present)
  if (strictDynamic) {
    policies.push(KeywordValue.StrictDynamic);
  }

  // 3. Add 'inline-speculation-rules' (if present)
  if (inlineSpeculationRules) {
    policies.push(KeywordValue.InlineSpeculationRules);
  }

  // 4. Add 'report-sample' (if present)
  if (reportSample) {
    policies.push(KeywordValue.ReportSample);
  }

  // 5. Add Unsafe Keywords (sorted alphabetically) to the policy
  for (
    const [key, value] of Object.entries(unsafe).sort(([keyA], [keyB]) =>
      keyA.localeCompare(keyB)
    )
  ) {
    if (value && isUnsafeKeyword(key)) {
      policies.push(UNSAFE_KEYWORD_MAP[key]);
    }
  }

  // 6. Add Scheme Keywords (sorted alphabetically) to the policy
  for (
    const [key, value] of Object.entries(schema).sort(([keyA], [keyB]) =>
      keyA.localeCompare(keyB)
    )
  ) {
    if (value && isSchemeKeyword(key)) {
      policies.push(SCHEME_KEYWORD_MAP[key]);
    }
  }

  // 7. Add Hosts to the policy
  for (const host of hosts) {
    // TODO(erictaylor): Maybe do some validation here?
    policies.push(host);
  }

  // 8. Add Hashes to the policy
  for (const { algorithm, hash } of hashes) {
    policies.push(formatHashValue(algorithm, hash));
  }

  // 9. Add Nonces to the policy
  for (const nonce of nonces) {
    policies.push(formatNonceValue(nonce));
  }

  return policies.join(' ');
}
