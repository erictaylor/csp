# Styleguide

The aim of this guide is to help contributors maintain consistent patterns
throughout the codebase and to provide end users with content that educates
users on how to use the library.

## Language

Use English (en-US) for all code, comments, and documentation. This includes the
spelling of words and the use of punctuation.

## File naming

File names should be in `kebab-case` and should be descriptive of the file's
contents. For example, a file containing utility functions for working with
arrays could be named `array-utils.ts`.

## Add tests for new features

Each module should be accompanied by tests for its public functionality.

Test files should be named the same as the module they are testing, with the
addition of a `.test.ts` extension. For example, a test file for a module named
`array-utils.ts` should be named `array-utils.test.ts`.

## TODO Comments

TODO comments should usually include an issue or the author's GitHub username in
parentheses.

Example:

```ts
// TODO(erictaylor): Add tests.
// TODO(#123): Fix compatibility with Node.js.
// FIXME(#456): Sometimes this function throws an error.
```

## ASCII

Prefer ASCII characters over Unicode characters in code and comments. This helps
ensure that the code is consistent, readable and maintainable by all
contributors.

## Meta-programming is discouraged

This includes the use of `Proxy`.

Be explicit, even when it means more code. There are some situations where it
may make sense to use such techniques, but in the vast majority of cases it does
not.

## TypeScript

Use [TypeScript](https://www.typescriptlang.org/) for all code in the
repository. This ensures type safety, better code quality, and improved
developer experience.

JavaScript files (ie. `.js`, `.mjs`) should not be present in the repository.

### ESM only

Use ESM (ECMAScript Modules) for all code in the repository. No CommonJS modules
(ie. `require`) should be present in the repository.

### Do not use the filename `index.ts`

If a directory of code needs a default entry point, use the filename `mod.ts`.
The filename `mod.ts` follows Rust's convention, is shorter than `index.ts`, and
doesn't come with any preconceived notions about how it might work.

### If a filename starts with an underscore: `_foo.ts`, do not link to it

There may be situations where an internal module is necessary but its API is not
meant to be stable or linked to. In this case prefix it with an underscore. By
convention, only files in its own directory should import it.

### Export all interfaces/types that are used as parameters to an exported member

Whenever you are using interfaces/types that are included in the parameters or
return type of an exported member, you should export the interface/type that is
used.

```ts ignore
// my-file.ts
export interface Person {
  name: string;
  age: number;
}

export function createPerson(name: string, age: number): Person {
  return { name, age };
}

// mod.ts
export { createPerson, type Person } from './my-file.ts';
```

### Prefer interfaces over intersections

Much of the time, a simple type alias to an object type acts very similarly to
an interface.

```ts ignore
interface Foo {
  prop: string;
}

type Bar = { prop: string };
```

However, and as soon as you need to compose two or more types, you have the
option of extending those types with an interface, or intersecting them in a
type alias, and that's when the differences start to matter.

Interfaces create a single flat object type that detects property conflicts,
which are usually important to resolve! Intersections on the other hand just
recursively merge properties, and in some cases produce never. Interfaces also
display consistently better, whereas type aliases to intersections can't be
displayed in part of other intersections. Type relationships between interfaces
are also cached, as opposed to intersection types as a whole. A final noteworthy
difference is that when checking against a target intersection type, every
constituent is checked before checking against the "effective"/"flattened" type.

For this reason, extending types with interfaces/extends is suggested over
creating intersection types.

```diff
- type Foo = Bar & Baz & {
-     someProp: string;
- }
+ interface Foo extends Bar, Baz {
+     someProp: string;
+ }
```

### Prefer base types over unions

Union types are great - they let you express the range of possible values for a
type.

```ts ignore
interface WeekdaySchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  wake: Time;
  startWork: Time;
  endWork: Time;
  sleep: Time;
}

interface WeekendSchedule {
  day: 'Saturday' | 'Sunday';
  wake: Time;
  familyMeal: Time;
  sleep: Time;
}

declare function printSchedule(schedule: WeekdaySchedule | WeekendSchedule);
```

However, they also come with a cost. Every time an argument is passed to
printSchedule, it has to be compared to each element of the union. For a
two-element union, this is trivial and inexpensive. However, if your union has
more than a dozen elements, it can cause real problems in compilation speed. For
instance, to eliminate redundant members from a union, the elements have to be
compared pairwise, which is quadratic. This sort of check might occur when
intersecting large unions, where intersecting over each union member can result
in enormous types that then need to be reduced. One way to avoid this is to use
subtypes, rather than unions.

```ts ignore
interface Schedule {
  day:
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';
  wake: Time;
  sleep: Time;
}

interface WeekdaySchedule extends Schedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startWork: Time;
  endWork: Time;
}

interface WeekendSchedule extends Schedule {
  day: 'Saturday' | 'Sunday';
  familyMeal: Time;
}

declare function printSchedule(schedule: Schedule);
```

A more realistic example of this might come up when trying to model every
built-in DOM element type. In this case, it would be preferable to create a base
`HtmlElement` type with common members which `DivElement`, `ImgElement`, etc.
all extend from, rather than to create an exhaustive union like `DivElement` |
/_..._/ | `ImgElement` | /_..._/.

### Exported functions: max 2 args, put the rest into an options object

When designing function interfaces, stick to the following rules:

1. A function that is part of the public API takes 0-2 required arguments, plus
   (if necessary) an options object (so max 3 total).
2. Optional parameters should generally go into the options object.

   An optional parameter that's not in an options object might be acceptable if
   there is only one, and it seems inconceivable that we would add more optional
   parameters in the future.
3. When one of the arguments is a function, you can adjust the order flexibly.

### Top-level functions should not use arrow syntax

Top-level functions should use the `function` keyword. Arrow syntax should be
limited to closures.

Bad:

```ts ignore
export const foo = (): string => {
  return 'foo';
};
```

Good:

```ts ignore
export function foo(): string {
  return 'foo';
}
```

## Documentation

Strive for complete documentation. Every exported symbol should have a
documentation line.

For a detailed guide, refer to the
[Deno blog on documenting JavaScript packages](https://deno.com/blog/document-javascript-package).

### Write concise summaries

Begin each JSDoc comment with a brief, clear description of the function or
symbol, allowing users to understand its purpose immediately.

### Provide type information

Use TypeScript interfaces/types to specify parameters and return types, aiding
autocomplete and filtering in IDEs.

### Add examples

Include practical examples using the `@example` tag, especially for complex
functions, so users can grasp usage quickly.

### Use JSDoc tags

Use tags like `@param`, `@returns`, and `@throws` to provide additional context
and information about the function or symbol. Use `@module` for module-level
summaries. `@deprecated` should be used when a function or symbol is no longer
recommended for use.

### Markdown support

Use markdown in comments for readable, organized content with links, bold/italic
text, and code snippets.

### Document every exported symbol

Include documentation for each exported function, class, interface, type alias,
and constant with JSDoc comments on all methods and properties.

### Internal linking

Utilize `@link`, `@linkcode`, and `@linkplain` tags for cross-referencing within
documentation, improving navigation.

### Test documentation

Run `deno test --doc` to ensure examples are accurate and `deno doc --lint` to
catch missing information.
