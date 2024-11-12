/** Supported hash algorithms supported by browser checks */
export const HASH_ALGORITHMS = ['SHA-256', 'SHA-384', 'SHA-512'] as const;
/** Supported hash algorithms type */
export type HashAlgorithm = typeof HASH_ALGORITHMS[number];

/** @ignore self explanatory */
export const CSP_HEADER = 'Content-Security-Policy';
/** @ignore self explanatory */
export const CSP_REPORT_ONLY_HEADER = 'Content-Security-Policy-Report-Only';
