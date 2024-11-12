import { HASH_ALGORITHMS, type HashAlgorithm } from './constants.ts';
import type { RemoveDashes } from './_type-helpers.ts';

/** General CSP source values */
export enum KeywordValue {
  /**
   * Allows the inclusion of [speculation rules](https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API) in
   * scripts (see also [`<script type="speculationrules">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/speculationrules)).
   */
  InlineSpeculationRules = "'inline-speculation-rules'",
  /** Won't allow loading of any resources */
  None = "'none'",
  /** Require a sample of the violating code to be included in the violation report. */
  ReportSample = "'report-sample'",
  /** Only allow resources from the current origin */
  Self = "'self'",
  /**
   * The trust granted to a script in the page due to an accompanying nonce or hash
   * is extended to the script it loads.
   */
  StrictDynamic = "'strict-dynamic'",
}

/** Unsafe CSP source values */
export enum UnsafeKeywordValue {
  /**
   * Allow use of dynamic code evaluation such as
   * [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval),
   * [`setTimeout()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout),
   * and `window.execScript`.
   */
  UnsafeEval = "'unsafe-eval'",
  /** Allows enabling specific inline event handlers. */
  UnsafeHashes = "'unsafe-hashes'",
  /** Allow use of inline resources. */
  UnsafeInline = "'unsafe-inline'",
  /**
   * Allows the loading and execution of WebAssembly modules without the need to also
   * allow unsafe JavaScript execution via `unsafe-eval`.
   */
  WasmUnsafeEval = "'wasm-unsafe-eval'",
}

/**
 * Schema source values.
 *
 * A scheme such as `http:` or `https:`.
 * Unlike other values, encapsulating in single quotes is not required.
 *
 * **Note:** Specifying data schemes is not recommended.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#scheme-source
 */
export enum SchemeSourceValue {
  /** Allows the use of the `blob:` scheme. */
  Blob = 'blob:',
  /**
   * Allows `data:` URLs to be used as a content source.
   *
   * _This is insecure; an attacker can also inject arbitrary `data:` URLs.
   * Use this sparingly and definitely not for scripts._
   */
  Data = 'data:',
  /** Allows the use of the `filesystem:` scheme. */
  Filesystem = 'filesystem:',
  /** Allows the use of the `http:` scheme. */
  Http = 'http:',
  /** Allows the use of the `https:` scheme. */
  Https = 'https:',
  /** Allows the use of the `mediastream:` scheme. */
  Mediastream = 'mediastream:',
  /** Allows the use of the `ws:` scheme. */
  Websocket = 'ws:',
  /** Allows the use of the `wss:` scheme. */
  Wss = 'wss:',
}

/**
 * Internet host by name or IP address. The URL scheme, port number, and path are optional.
 * Wildcards (`'*'`) can be used for subdomains, host address, and port number, indicating
 * that all legal values of each are valid. When matching schemes, secure upgrades are
 * allowed (e.g. specifying `http://example.com` will match `https://example.com`).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#host-source
 */
export type HostValue = string;

/**
 * A valid formatted CSP nonce value.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#nonce-
 */
export type NonceValue = `'nonce-${string}'`;

/** CSP hash prefixes */
export type FormattedHashAlgorithm = Lowercase<RemoveDashes<HashAlgorithm>>;

/**
 * A valid formatted CSP hash value.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#hash-
 */
export type HashValue = `'${FormattedHashAlgorithm}-${string}'`;

/**
 * Generates a random nonce value that is base64 encoded.
 *
 * @returns A random nonce value.
 *
 * @example Usage
 * ```ts
 * import { randomNonce } from '@erictaylor/csp/value';
 *
 * const nonce = randomNonce(); // 'N2U4ZWVlZjktZWU0NC00YWViLThiMDYtODliNmM5ZmM1ZmRl'
 * ```
 */
export function randomNonce(): string {
  const uuid = crypto.randomUUID();
  const buffer = new TextEncoder().encode(uuid);

  return btoa(String.fromCharCode(...buffer));
}

/**
 * Creates a nonce value string for a [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP).
 *
 * A cryptographic nonce (only used once) to allow scripts.
 * The server must generate a unique nonce value each time it transmits a policy.
 * It is critical to provide a nonce that cannot be guessed as
 * bypassing a resource's policy is otherwise trivial.
 * This is used in conjunction with the [script tag nonce attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-nonce).
 *
 * @param nonce A single use token that is unique for each page load.
 * @returns A {@linkcode NonceValue}
 *
 * @example Usage
 * ```ts
 * import { formatNonceValue, randomNonce } from '@erictaylor/csp/value';
 * import { assertEquals } from '@std/assert';
 *
 * const nonce = randomNonce();
 *
 * assertEquals(formatNonceValue(nonce), `'nonce-${nonce}'`);
 * ```
 */
export function formatNonceValue(nonce: string): NonceValue {
  return `'nonce-${nonce.trim()}'`;
}

function formatHashAlgorithm(algorithm: HashAlgorithm): FormattedHashAlgorithm {
  return algorithm.toLowerCase().replace('-', '') as FormattedHashAlgorithm;
}

/**
 * Builds a hash value string for a [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP).
 *
 * @param algorithm - The {@linkcode HashAlgorithm} to use.
 * @param hash - The hash value.
 * @returns A {@linkcode HashValue}
 *
 * @example Usage
 * ```ts
 * import { formatHashValue } from '@erictaylor/csp/value';
 * import { assertEquals } from '@std/assert';
 *
 * const message = 'Hello, World!';
 * const messageBuffer = new TextEncoder().encode(message);
 * const hashBuffer = await crypto.subtle.digest('SHA-256', messageBuffer);
 * const hashArray = Array.from(new Uint8Array(hashBuffer));
 * const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
 *
 * assertEquals(formatHashValue('SHA-256', hashHex), `'sha256-${hashHex}'`);
 * ```
 */
export function formatHashValue(
  algorithm: HashAlgorithm,
  hash: string,
): HashValue {
  if (!HASH_ALGORITHMS.includes(algorithm)) {
    throw new Error(`Invalid hash algorithm: ${algorithm}`);
  }

  return `'${formatHashAlgorithm(algorithm)}-${hash.trim()}'`;
}

/**
 * Hashes a source string (UTF-8) using a specified algorithm
 * and returns the hash as a base64 encoded string.
 *
 * @param algorithm {@linkcode HashAlgorithm}
 * @param source The source content to hash.
 * @returns A promise that resolves to a base64 encoded hash.
 *
 * @example Usage
 * ```ts
 * import { hashSource } from '@erictaylor/csp/value';
 * import { assertEquals } from '@std/assert';
 *
 * const source = 'console.log("Hello world!");';
 * const hash = await hashSource('SHA-256', source);
 *
 * assertEquals(hash, 'wFNeS+K3n/2TKRMFQ2v4iTFOSj+uwF7P/Lt98xrZ5Ro=');
 * ```
 */
export async function hashSource(
  algorithm: HashAlgorithm,
  source: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(source);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);

  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
}
