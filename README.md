# mikser-io-render-ect

[ECT](https://www.npmjs.com/package/ect) renderer for [Mikser](https://github.com/almero-digital-marketing/mikser-io). Renders entities whose layout uses the `.ect` template engine.

Mikser doesn't pick your template engine for you — install the renderer that matches the syntax your team already knows. ECT is a fast, lean choice with CoffeeScript-style logic and embedded blocks. You can mix engines in the same project (`.hbs`, `.eta`, `.liquid`, `.ect` all coexist on different layouts).

## Install

```bash
npm install mikser-io-render-ect
```

## Usage

```js
// mikser.config.js
export default {
  renderer: 'ect'
}
```

Mikser will pick this plugin up automatically when an entity is rendered with `renderer: 'ect'`. Layouts are resolved from the configured `layoutsFolder` with the `.ect` extension; the entity runtime is passed to the template as its data context.

## Limitation: YAML frontmatter on layouts

Other mikser renderers (`hbs`, `eta`, `liquid`) read the layout body from `entity.layout.content`, which the front-matter plugin strips of YAML before rendering. That lets layout authors declare `match`, `mcpUi`, SEO defaults, etc. at the top of the file.

This renderer still loads layouts via ECT's own file-based resolver (because ECT's `extends`/`include` machinery is tightly coupled to its loader). YAML frontmatter at the top of an `.ect` file will be rendered as literal text. If you need self-describing layouts, pick `hbs`/`eta`/`liquid` for those specific templates — engines mix freely in one project.

## License

MIT
