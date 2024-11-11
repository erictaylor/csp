export const HASH_ALGORITHMS = ['SHA-256', 'SHA-384', 'SHA-512'] as const;
export type HashAlgorithm = typeof HASH_ALGORITHMS[number];

export const CSP_HEADER = 'Content-Security-Policy';
export const CSP_REPORT_ONLY_HEADER = 'Content-Security-Policy-Report-Only';
