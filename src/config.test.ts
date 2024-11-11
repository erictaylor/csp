import { assertEquals } from '@std/assert';
import { configToSourceExpressionList } from './config.ts';
import {
  KeywordValue,
  SchemeSourceValue,
  UnsafeKeywordValue,
} from './value.ts';

Deno.test('configToSourceExpressionList() returns empty string for empty config', () => {
  assertEquals(configToSourceExpressionList({}), '');
});

Deno.test('configToSourceExpressionList() ignores false config values', () => {
  assertEquals(
    configToSourceExpressionList({
      self: false,
      inlineSpeculationRules: false,
      strictDynamic: false,
      reportSample: false,
      unsafe: {
        unsafeEval: false,
        unsafeHashes: false,
        unsafeInline: false,
        wasmUnsafeEval: false,
      },
      schema: {
        blob: false,
        data: false,
        filesystem: false,
        http: false,
        https: false,
        mediastream: false,
        ws: false,
        wss: false,
      },
    }),
    '',
  );
});

Deno.test('configToSourceExpressionList() returns formatted hashes', () => {
  assertEquals(
    configToSourceExpressionList({
      hashes: [
        { algorithm: 'SHA-256', hash: 'abc123' },
        { algorithm: 'SHA-384', hash: 'abc123' },
        { algorithm: 'SHA-512', hash: 'abc123' },
      ],
    }),
    "'sha256-abc123' 'sha384-abc123' 'sha512-abc123'",
  );
});

Deno.test('configToSourceExpressionList() returns formatted nonces', () => {
  assertEquals(
    configToSourceExpressionList({
      nonces: ['abc123', 'foobar'],
    }),
    "'nonce-abc123' 'nonce-foobar'",
  );
});

Deno.test('configToSourceExpressionList() returns hosts verbatim', () => {
  assertEquals(
    configToSourceExpressionList({
      hosts: ['https://www.youtube.com', '*.example.com'],
    }),
    'https://www.youtube.com *.example.com',
  );
});

Deno.test('configToSourceExpressionList() returns full policy', () => {
  assertEquals(
    configToSourceExpressionList({
      hashes: [
        { algorithm: 'SHA-256', hash: 'abc123' },
        { algorithm: 'SHA-384', hash: 'abc123' },
        { algorithm: 'SHA-512', hash: 'abc123' },
      ],
      hosts: ['https://www.youtube.com', '*.example.com'],
      inlineSpeculationRules: true,
      nonces: ['abc123', 'foobar'],
      reportSample: true,
      schema: {
        blob: true,
        data: true,
        filesystem: true,
        http: true,
        https: true,
        mediastream: true,
        ws: true,
        wss: true,
      },
      self: true,
      strictDynamic: true,
      unsafe: {
        unsafeEval: true,
        unsafeHashes: true,
        unsafeInline: true,
        wasmUnsafeEval: true,
      },
    }),
    [
      KeywordValue.Self,
      KeywordValue.StrictDynamic,
      KeywordValue.InlineSpeculationRules,
      KeywordValue.ReportSample,

      UnsafeKeywordValue.UnsafeEval,
      UnsafeKeywordValue.UnsafeHashes,
      UnsafeKeywordValue.UnsafeInline,
      UnsafeKeywordValue.WasmUnsafeEval,

      SchemeSourceValue.Blob,
      SchemeSourceValue.Data,
      SchemeSourceValue.Filesystem,
      SchemeSourceValue.Http,
      SchemeSourceValue.Https,
      SchemeSourceValue.Mediastream,
      SchemeSourceValue.Websocket,
      SchemeSourceValue.Wss,

      'https://www.youtube.com',
      '*.example.com',

      "'sha256-abc123'",
      "'sha384-abc123'",
      "'sha512-abc123'",

      "'nonce-abc123'",
      "'nonce-foobar'",
    ].join(' '),
  );
});
