# mikser-io-render-ect

[ECT](https://github.com/baryshev/ect) renderer for [Mikser](https://github.com/almero-digital-marketing/mikser-io). Renders entities whose layout uses the `.ect` template engine.

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
