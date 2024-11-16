import { assertEquals } from '@std/assert';
import { shuffle } from '@std/random';
import {
  DIRECTIVE_SORT_ORDER,
  DocumentDirective,
  FetchDirective,
  NavigationDirective,
  OtherDirective,
  ReportingDirective,
  sortDirectives,
} from './directive.ts';

Deno.test('sortDirectives() sorts directives in custom order', () => {
  const shuffledDirectives = shuffle([
    ...Object.values({
      ...FetchDirective,
      ...DocumentDirective,
      ...NavigationDirective,
      ...ReportingDirective,
      ...OtherDirective,
    }),
  ]);

  assertEquals(
    shuffledDirectives.sort(sortDirectives),
    DIRECTIVE_SORT_ORDER,
  );
});
