import type { HashAlgorithm } from './constants.ts';
import { deepFreeze } from './_helpers.ts';
import {
  formatHashValue,
  formatNonceValue,
  KeywordValue,
  SchemeSourceValue,
  UnsafeKeywordValue,
} from './value.ts';

/**
 * Base configuration that contains the base
 * keyword source values (excluding 'none')
 *
 * Based off {@linkcode KeywordValue}
 */
export interface BaseKeywordConfig {
  /**
   * Allows the inclusion of [speculation rules](https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API)
   * in scripts (see also [`<script type="speculationrules">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/speculationrules)).
   */
  readonly inlineSpeculationRules?: boolean;
  /**
   * Requires a sample of the violating code to be included in the violation report.
   */
  readonly reportSample?: boolean;
  /**
   * Refers to the origin from which the protected document is being served,
   * including the same URL scheme and port number.
   *
   * Some browsers specifically exclude `blob:` and `filesystem:`
   * from source directives. Sites needing to allow these content
   * types can specify them using the Data attribute.
   */
  readonly self?: boolean;
  /**
   * Specifies that the trust explicitly given to a script present
   * in the markup, by accompanying it with a nonce or a hash,
   * shall be propagated to all the scripts loaded by that root script.
   * At the same time, any allowlist or source expressions such as
   * `'self'` or `'unsafe-inline'` are ignored.
   * See [script-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src#strict-dynamic) for an example.
   */
  readonly strictDynamic?: boolean;
}

/**
 * Configuration for unsafe keywords
 *
 * Based off {@linkcode UnsafeKeywordValue}
 *
 * > **Note:** As the name implies, these keywords are considered unsafe
 * > and should be used with caution.
 */
export interface UnsafeKeywordConfig {
  /**
   * Allows the use of `eval()` and other unsafe methods for
   * creating code from strings.
   *
   * > **Important:**
   * > This is considered unsafe and should be avoided
   * > because of the code injection risk it presents.
   * > [Read more](https://web.dev/articles/csp#unsafe-eval)
   */
  readonly unsafeEval?: boolean;
  /**
   * Allows enabling specific inline [event handlers](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#event_handlers).
   * If you only need to allow inline event handlers and not inline `<script>`
   * elements or `javascript:` URLs, this is a safer method than using the
   * `'unsafe-inline'` expression.
   */
  readonly unsafeHashes?: boolean;
  /**
   * Allows the use of inline resources, such as inline `<script>` elements,
   * `javascript:` URLs, inline event handlers, and inline `<style>` elements.
   */
  readonly unsafeInline?: boolean;
  /**
   * Allows the loading and execution of WebAssembly modules without the need
   * to also allow unsafe JavaScript execution via `'unsafe-eval'`.
   */
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

/**
 * Configuration for scheme keywords
 *
 * Based off {@linkcode SchemeSourceValue}
 */
export interface SchemeKeywordConfig {
  /**
   * Allows [`blob:` URIs](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
   * to be used as content source.
   */
  readonly blob?: boolean;
  /**
   * Allows [`data:` URLs](https://developer.mozilla.org/en-US/docs/Web/URI/Schemes/data)
   * to be used as a content source.
   *
   * > **Important:**
   * > This is insecure; an attacker can also inject arbitrary `data:` URLs.
   * > Use this sparingly and definitely not for scripts.
   */
  readonly data?: boolean;
  /**
   * Allows [`filesystem:` URIs](https://developer.mozilla.org/en-US/docs/Web/API/FileSystem)
   * to be used as a content source.
   */
  readonly filesystem?: boolean;
  /**
   * Allows HTTP URLs to be used as a content source.
   */
  readonly http?: boolean;
  /**
   * Allows HTTPS URLs to be used as a content source.
   */
  readonly https?: boolean;
  /**
   * Allows [`mediastream:` URIs](https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API)
   * to be used as a content source.
   */
  readonly mediastream?: boolean;
  /**
   * Allows WebSocket URLs to be used as a content source.
   */
  readonly ws?: boolean;
  /**
   * Allows secure WebSocket URLs to be used as a content source.
   */
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

/**
 * Configuration object that combines all keyword source values.
 */
export interface KeywordConfig extends BaseKeywordConfig {
  /**
   * Selectively enable scheme sources.
   */
  readonly schema?: SchemeKeywordConfig;
  /**
   * Selectively enable unsafe sources.
   */
  readonly unsafe?: UnsafeKeywordConfig;
}

/**
 * Configuration object that combines all keyword source values
 * and adds support for hashes, hosts, and nonces.
 */
export interface PolicyConfig extends KeywordConfig {
  /**
   * A allow list of hashes for resources allowed to load.
   *
   * A SHA-256, SHA-384, or SHA-512 hash of scripts or styles.
   * This value consists of the algorithm used to create the hash
   * followed by a hyphen and the base64-encoded hash of the script
   * or style.
   *
   * When generating the hash, exclude `<script>` or `<style>` tags
   * and note that capitalization and whitespace matter, including
   * leading or trailing whitespace.
   *
   * Use the {@linkcode hashSource} utility to generate hashes.
   */
  readonly hashes?: ReadonlyArray<
    { readonly algorithm: HashAlgorithm; readonly hash: string }
  >;
  /**
   * An allow list of internet hosts by name or IP address.
   *
   * The [URL scheme](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL),
   * port number, and path are optional. Wildcards (`'*'`) can be used for subdomains,
   * host address, and port number, indicating that all legal values of each are valid.
   * When matching schemes, secure upgrades are allowed (e.g. specifying `http://example.com`
   * will match `https://example.com`).
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#host-source
   */
  readonly hosts?: ReadonlyArray<string>;
  /**
   * An allow list for specific scripts using a cryptographic nonce (number used once).
   * The server must generate a unique nonce value each time it transmits a policy.
   * It is critical to provide an unguessable nonce, as bypassing a resource's policy
   * is otherwise trivial.
   *
   * Specifying nonce makes a modern browser ignore `'unsafe-inline'` which could
   * still be set for older browsers without nonce support.
   *
   * Use the {@linkcode randomNonce} utility to generate random nonces.
   */
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
