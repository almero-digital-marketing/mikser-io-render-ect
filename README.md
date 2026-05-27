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

## License

MIT
