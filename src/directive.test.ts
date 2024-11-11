import { assertEquals } from '@std/assert';
import { shuffle } from '@std/random';
import {
  Directive,
  DIRECTIVE_SORT_ORDER,
  sortDirectives,
} from './directive.ts';

Deno.test('sortDirectives() sorts directives in custom order', () => {
  const shuffledDirectives = shuffle([
    ...Object.values(Directive),
  ]);

  assertEquals(
    shuffledDirectives.sort(sortDirectives),
    DIRECTIVE_SORT_ORDER,
  );
});
