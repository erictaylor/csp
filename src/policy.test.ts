import { assertEquals } from '@std/assert';
import { formatPolicyDirective, formatPolicyDirectiveList } from './policy.ts';
import { Directive } from './directive.ts';

Deno.test('formatPolicyDirective() formats a simple policy directive', () => {
  assertEquals(
    formatPolicyDirective(Directive.DefaultSrc, "'self'"),
    "default-src 'self'",
  );
});

Deno.test('formatPolicyDirective() formats a complex policy directive', () => {
  assertEquals(
    formatPolicyDirective(
      Directive.ScriptSrc,
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
    ),
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  );
});

Deno.test('formatPolicyDirective() formats a policy directive without values', () => {
  assertEquals(
    formatPolicyDirective(Directive.Sandbox),
    'sandbox',
  );
});

Deno.test('formatPolicyDirective() formats a policy directive with leading and trailing whitespace', () => {
  assertEquals(
    formatPolicyDirective(Directive.DefaultSrc, " 'self' "),
    "default-src 'self'",
  );
});

Deno.test('formatPolicyDirectiveList() formats a list of policy directives', () => {
  const policy = formatPolicyDirectiveList(
    [Directive.DefaultSrc, "'self'"],
    [Directive.ScriptSrc, "'self'", "'unsafe-inline'", "'unsafe-eval'"],
  );

  assertEquals(
    policy,
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  );
});

Deno.test('formatPolicyDirectiveList() sorts policy directives by default with sortDirectives()', () => {
  const policy = formatPolicyDirectiveList(
    [Directive.ScriptSrc, "'self'", "'unsafe-inline'", "'unsafe-eval'"],
    [Directive.DefaultSrc, "'self'"],
    [Directive.Sandbox],
    [Directive.WorkerSrc, "'none'"],
    [Directive.FontSrc, "'self'"],
  );

  assertEquals(
    policy,
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; font-src 'self'; worker-src 'none'; sandbox",
  );
});

Deno.test('formatPolicyDirectiveList() sorts policy directives with a custom sorting function', () => {
  const policy = formatPolicyDirectiveList(
    // reverse alphabetical order
    (a, b) => b.localeCompare(a),
    [Directive.ScriptSrc, "'self'", "'unsafe-inline'", "'unsafe-eval'"],
    [Directive.DefaultSrc, "'self'"],
    [Directive.Sandbox],
    [Directive.WorkerSrc, "'none'"],
    [Directive.FontSrc, "'self'"],
  );

  assertEquals(
    policy,
    "worker-src 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; sandbox; font-src 'self'; default-src 'self'",
  );
});
