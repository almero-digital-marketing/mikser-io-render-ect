# mikser-io-render-ect

> **Deprecated.** This renderer still works and is still supported, but it will
> be removed in a future major. [`mikser-io-render-eta`](https://www.npmjs.com/package/mikser-io-render-eta)
> is the closest replacement. If you are starting something new, start there.

[ECT](https://www.npmjs.com/package/ect) renderer for [Mikser](https://github.com/almero-digital-marketing/mikser-io).
Renders entities whose layout uses the `.ect` template engine.

## Why it is deprecated

Nothing about ECT stopped working. What happened is that mikser grew features
an ect layout cannot take part in, and the gap is now wide enough to name.

**It cannot describe itself.** Every other renderer exposes a
`parseReferences()` that reports what a template depends on — the variables it
reads, the partials it pulls in, and the arguments it passes them. That is what
`mikser_layouts_inspect` assembles into a layout's *contract*: the set of
document keys the whole layout tree actually consumes, resolved through
includes and aliases into the vocabulary an author writes.

ECT compiles templates directly to CoffeeScript and evaluates them, exposing no
AST at any point, so there is nothing to read a contract out of. An ect layout
shows up in that contract only as a gap — honestly reported, but a gap. For a
person that is a missing convenience. For an agent writing content unattended
it is the difference between checking its work and guessing, which is exactly
the failure this feature exists to prevent.

**It cannot read YAML frontmatter on layouts.** The other renderers take the
layout body from `entity.layout.content`, which the front-matter plugin has
already stripped. This one resolves layout files through ECT's own loader,
because ECT's `extend`/`include` machinery is coupled to it — so frontmatter at
the top of an `.ect` file renders as literal text, and `match`, `mcpUi` and SEO
defaults cannot be declared on an ect layout at all.

**Its dependency is old.** `ect@0.5.9` depends on `coffee-script` — the package
name retired when CoffeeScript 2 renamed itself to `coffeescript` — at 1.x, and
declares `engines: node >= 0.4.0`.

## Moving to eta

Eta is the closest fit: the same embedded-code shape, and its include call maps
almost one to one.

| ECT | eta | |
| --- | --- | --- |
| `<%= @title %>` | `<%= it.title %>` | escaped in both |
| `<%- @title %>` | `<%~ it.title %>` | raw — note the tag changes |
| `<% include 'ui/btn', { label: @cta } %>` | `<% include('ui/btn', { label: it.cta }) %>` | |
| `<% extend 'page' %>` | `<% layout('page') %>` | |
| CoffeeScript in `<% %>` | JavaScript in `<% %>` | |

The context object is the same one either way — ECT reaches it through `@`,
eta through `it`.

Mind the second row. Both engines spell escaped output `<%= %>`, which makes
them look interchangeable, but they disagree on the raw form: ECT writes it
`<%- %>` and eta writes it `<%~ %>`. Carried across unchanged, `<%- %>` is not
an error in eta — it is parsed as ordinary code and silently emits nothing, so
the markup simply disappears from the page.

Engines mix freely in one project, so this does not have to be one migration.
Add `renderEta()` alongside `renderEct()` and move layouts a file at a time.

```js
// mikser.config.js
import { layouts } from 'mikser-io'
import { renderEct } from 'mikser-io-render-ect'
import { renderEta } from 'mikser-io-render-eta'

export default {
  plugins: [
    layouts(),
    renderEta(),
    renderEct(),   // still here, for the layouts not moved yet
  ]
}
```

## While you are still on it

It keeps working. On load it logs one deprecation warning, which also reaches
the build report as `deprecated-plugin` — once per build, not once per render.

If you have read it and decided to stay for now, silence it rather than
filtering it out. A build that carries a warning nobody intends to act on
teaches everyone to ignore the warning count:

```js
renderEct({ silenceDeprecation: true })
```

## Install

```bash
npm install mikser-io-render-ect
```

## Usage

```js
// mikser.config.js
import { layouts } from 'mikser-io'
import { renderEct } from 'mikser-io-render-ect'

export default {
  plugins: [
    layouts(),
    renderEct(),
  ]
}
```

Mikser picks this renderer up for any entity whose layout dispatches to `ect`
(e.g. `<name>.<format>.ect` layout filenames, or `render: ect` in layout
frontmatter). Layouts are resolved from the configured `layoutsFolder` with the
`.ect` extension; the entity runtime is passed to the template as its data
context.

## License

MIT
