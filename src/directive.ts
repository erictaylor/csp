import { deepFreeze } from './_helpers.ts';

/**
 * [Fetch directives](https://developer.mozilla.org/en-US/docs/Glossary/Fetch_directive)
 * control the locations from which certain resource types may be loaded.
 */
export enum FetchDirective {
  /**
   * Defines the valid sources for [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
   * and nested browsing contexts loaded using elements such as [`<frame>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/frame)
   * and [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe).
   *
   * > **Warning:**
   * > Instead of `child-src`, if you want to regulate nested browsing contexts and workers,
   * > you should use the `frame-src` and `worker-src` directives, respectively.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/child-src)
   */
  ChildSrc = 'child-src',
  /**
   * Restricts the URLs which can be loaded using script interfaces.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/connect-src)
   */
  ConnectSrc = 'connect-src',
  /**
   * Serves as a fallback for the other {@link FetchDirectives}.
   */
  DefaultSrc = 'default-src',
  /**
   * Specifies valid sources for nested browsing contexts
   * loaded into [`<fencedframe>`](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#fenced-frame-src) elements.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/fenced-frame-src)
   * @experimental Expect behavior to change in the future.
   */
  FencedFrameSrc = 'fenced-frame-src',
  /**
   * Specifies valid sources for fonts loaded using [`@font-face`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face).
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/font-src)
   */
  FontSrc = 'font-src',
  /**
   * Specifies valid sources for nested browsing contexts loaded
   * into elements such as [`<frame>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/frame)
   * and [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe).
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-src)
   */
  FrameSrc = 'frame-src',
  /**
   * Specifies valid sources of images and favicons.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/img-src)
   */
  ImgSrc = 'img-src',
  /**
   * Specifies valid sources of application manifest files.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/manifest-src)
   */
  ManifestSrc = 'manifest-src',
  /**
   * Specifies valid sources for loading media using the
   * [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio),
   * [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) and
   * [`<track>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track) elements.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/media-src)
   */
  MediaSrc = 'media-src',
  /**
   * Specifies valid sources for the
   * [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object) and
   * [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed) elements.
   *
   * > **Note:** Elements controlled by `object-src` are perhaps coincidentally considered legacy
   * > HTML elements and are not receiving new standardized features (such as the security attributes
   * > `sandbox` or `allow` for `<iframe>`). Therefore it is **recommended** to restrict this
   * > fetch-directive (e.g., explicitly set `object-src 'none'` if possible).
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/object-src)
   */
  ObjectSrc = 'object-src',
  /**
   * Specifies valid sources to be prefetched or prerendered.
   *
   * @deprecated Not standard and should not be used on new sites.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/prefetch-src)
   */
  PrefetchSrc = 'prefetch-src',
  /**
   * Specifies valid sources for JavaScript and WebAssembly resources.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)
   */
  ScriptSrc = 'script-src',
  /**
   * Specifies valid sources for JavaScript inline event handlers.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src-attr)
   */
  ScriptSrcAttr = 'script-src-attr',
  /**
   * Specifies valid sources for JavaScript [`<script>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) elements.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src-elem)
   */
  ScriptSrcElem = 'script-src-elem',
  /**
   * Specifies valid sources for stylesheets.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src)
   */
  StyleSrc = 'style-src',
  /**
   * Specifies valid sources for inline styles applied to individual DOM elements.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src-attr)
   */
  StyleSrcAttr = 'style-src-attr',
  /**
   * Specifies valid sources for stylesheets
   * [`<style>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) elements
   * and [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) elements with `rel="stylesheet"`.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src-elem)
   */
  StyleSrcElem = 'style-src-elem',
  /**
   * Specifies valid sources for [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker),
   * [SharedWorker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker), or
   * [ServiceWorker](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker) scripts.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/worker-src)
   */
  WorkerSrc = 'worker-src',
}

/**
 * Document directives govern the properties of a document or
 * [worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) environment to which a policy applies.
 */
export enum DocumentDirective {
  /**
   * Restricts the URLs which can be used in document's
   * [`<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base) element.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/base-uri)
   */
  BaseUri = 'base-uri',
  /**
   * Enables a sandbox for the requested resource similar to the
   * [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)
   * [`sandbox`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox) attribute.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox)
   */
  Sandbox = 'sandbox',
}

/**
 * Navigation directives govern to which locations a user can navigate
 * or submit a form, for example.
 */
export enum NavigationDirective {
  /**
   * Restricts the URLs which can be used as the target
   * of a form submissions from a given context.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/form-action)
   */
  FormAction = 'form-action',
  /**
   * Specifies valid parents that may embed a page using
   * [`<frame>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/frame),
   * [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe),
   * [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object),
   * or [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed).
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)
   */
  FrameAncestors = 'frame-ancestors',
}

/**
 * Reporting directives control the destination URL for CSP violation reports
 * in `Content-Security-Policy` and
 * [`Content-Security-Policy-Report-Only`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only) headers.
 */
export enum ReportingDirective {
  /**
   * Provides the browser with a token identifying the reporting endpoint or group of endpoints
   * to send CSP violation information to. The endpoints that the token represents are provided
   * through other HTTP headers, such as [`Reporting-Endpoints`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Reporting-Endpoints)
   * and [`Report-To`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Report-To).
   *
   * > **Warning:** This directive is intended to replace `report-uri`; in browsers that support
   * > `report-to`, the `report-uri` directive is ignored. However until `report-to` is broadly
   * > supported you should specify both headers as shown (where `endpoint_name` is the name
   * > of a separately provided endpoint):
   * >
   * > ```http
   * > Content-Security-Policy: report-uri https://endpoint.example.com; report-to endpoint_name
   * > ```
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to)
   */
  ReportTo = 'report-to',
  /**
   * Specifies a URI to which the user agent sends reports about policy violation.
   *
   * @deprecated Use `report-to` instead.
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-uri)
   */
  ReportUri = 'report-uri',
}

export enum OtherDirective {
  /**
   * Enforces [Trusted Types](https://w3c.github.io/trusted-types/dist/spec/) at the DOM XSS injection sinks.
   *
   * @experimental Expect behavior to change in the future.
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/require-trusted-types-for)
   */
  RequireTrustedTypesFor = 'require-trusted-types-for',
  /**
   * Used to specify an allowlist of [Trusted Types](https://w3c.github.io/trusted-types/dist/spec/) policies.
   * Trusted Types allows applications to lock down DOM XSS injection sinks to only accept non-spoofable,
   * typed values in place of strings.
   *
   * @experimental Expect behavior to change in the future.
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types)
   */
  TrustedTypes = 'trusted-types',
  /**
   * Instructs user agents to treat all of a site's insecure URLs (those served over HTTP)
   * as though they have been replaced with secure URLS (those served over HTTPS).
   * This directive is intended for websites with large numbers of insecure legacy URLs
   * that need to be rewritten.
   *
   * @see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/upgrade-insecure-requests)
   */
  UpgradeInsecureRequests = 'upgrade-insecure-requests',
}

/**
 * A Content Security Policy (CSP) directive.
 */
export const Directive = {
  ...FetchDirective,
  ...DocumentDirective,
  ...NavigationDirective,
  ...ReportingDirective,
  ...OtherDirective,
};

/**
 * {@linkcode Directive}
 */
export type Directive =
  | FetchDirective
  | DocumentDirective
  | NavigationDirective
  | ReportingDirective
  | OtherDirective;

/** Custom order for Fetch Directives */
export const FETCH_DIRECTIVE_CUSTOM_ORDER: readonly FetchDirective[] =
  deepFreeze([
    FetchDirective.DefaultSrc,
    FetchDirective.ScriptSrc,
    FetchDirective.StyleSrc,
    FetchDirective.ImgSrc,
    FetchDirective.FontSrc,
  ]);

/** Custom sort order for all Directives. */
export const DIRECTIVE_SORT_ORDER: readonly Directive[] = deepFreeze([
  ...FETCH_DIRECTIVE_CUSTOM_ORDER,
  ...Object.values(FetchDirective).filter((d) =>
    FETCH_DIRECTIVE_CUSTOM_ORDER.includes(d) === false
  ).sort(),
  ...Object.values(NavigationDirective).sort(),
  ...Object.values(OtherDirective).sort(),
  ...Object.values(DocumentDirective).sort(),
  ...Object.values(ReportingDirective).sort(),
]);

/**
 * A utility function for sorting CSP directives.
 *
 * A custom sort order is used to ensure that the most common directives are listed first.
 * The order is as follows:
 *
 * 1. {@linkcode FetchDirective}
 *     1. `default-src` is always listed first.
 *     2. Followed by `script-src`, `style-src`, `img-src`, and `font-src`.
 *     3. Remaining fetch directives are listed in alphabetical order.
 * 2. {@linkcode NavigationDirective} (alphabetical)
 * 3. {@linkcode OtherDirective} (alphabetical)
 * 4. {@linkcode DocumentDirective} (alphabetical)
 * 5. {@linkcode ReportingDirective} (alphabetical)
 *
 * @param a - The first directive to compare.
 * @param b - The second directive to compare.
 * @returns A number indicating the sort order.
 */
export function sortDirectives(a: Directive, b: Directive): number {
  return DIRECTIVE_SORT_ORDER.indexOf(a) - DIRECTIVE_SORT_ORDER.indexOf(b);
}
