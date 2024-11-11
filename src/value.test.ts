import { assertEquals } from '@std/assert';
import {
  formatHashValue,
  formatNonceValue,
  hashSource,
  randomNonce,
} from './value.ts';

Deno.test('randomNonce() generates a random nonce value', () => {
  const nonce = randomNonce();

  assertEquals(typeof nonce, 'string');
  assertEquals(nonce.length, 48);
});

Deno.test('formatNonceValue() formats a nonce value', () => {
  const nonce = randomNonce();

  assertEquals(formatNonceValue(nonce), `'nonce-${nonce}'`);
});

Deno.test('formatNonceValue() formats a nonce value with leading and trailing whitespace', () => {
  const nonce = ' abc123 ';

  assertEquals(formatNonceValue(nonce), `'nonce-${nonce.trim()}'`);
});

Deno.test('formatHashValue() formats a hash value', () => {
  const hash = 'testHash';

  assertEquals(formatHashValue('SHA-256', hash), `'sha256-${hash}'`);
  assertEquals(formatHashValue('SHA-384', hash), `'sha384-${hash}'`);
  assertEquals(formatHashValue('SHA-512', hash), `'sha512-${hash}'`);
});

Deno.test('hashSource() SHA-256 hashes a source string', async () => {
  const source = 'Hello world!';
  const hash = await hashSource('SHA-256', source);

  assertEquals(hash.length, 44);
  assertEquals(
    hash,
    'wFNeS+K3n/2TKRMFQ2v4iTFOSj+uwF7P/Lt98xrZ5Ro=',
  );
});

Deno.test('hashSource() SHA-384 hashes a source string', async () => {
  const source = 'Hello world!';
  const hash = await hashSource('SHA-384', source);

  assertEquals(hash.length, 64);
  assertEquals(
    hash,
    'hiVfosNuSzCWnq4X3DTHcsvr38WLWEA5AL6HYU6xo0uHgCY/JV615lypu7hkHMz+',
  );
});

Deno.test('hashSource() SHA-512 hashes a source string', async () => {
  const source = 'Hello world!';
  const hash = await hashSource('SHA-512', source);

  assertEquals(hash.length, 88);
  assertEquals(
    hash,
    '9s3ioPgZMUzd5V/CJ9jX2uPSjMVWIioKitZtkcytSq1glPUXohgjYMmqz2o9wyMWLLb9jN/+2w/gOPVehf+1tg==',
  );
});
