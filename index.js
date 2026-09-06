import ECT from 'ect'
import { onLoad, useLogger } from 'mikser-io'

// DEPRECATED — see README.md. Still works, still supported for now, and will
// be removed in a future major. Three reasons, in order of how much they
// matter:
//
//   1. It cannot describe itself. Every other renderer exposes
//      parseReferences(), which is what mikser_layouts_inspect builds a
//      layout's CONTRACT from — the set of document keys the layout tree
//      actually consumes. ECT compiles templates straight to CoffeeScript and
//      evals them, exposing no AST, so an ect layout appears in that contract
//      only as a gap. An agent authoring content against an ect layout has
//      nothing to check itself against.
//   2. It cannot read YAML frontmatter on layouts, because it resolves layout
//      files through ECT's own loader rather than through entity.layout.content
//      (see README). So `match`, `mcpUi` and SEO defaults cannot be declared on
//      an ect layout.
//   3. Its dependency is `ect@0.5.9`, which depends on `coffee-script` — the
//      package name retired when CoffeeScript 2 renamed to `coffeescript` — at
//      1.x, and declares `engines: node >= 0.4.0`.
//
// None of that stops it rendering. It stops it participating in the things
// mikser has grown since.
const DEPRECATION =
    'mikser-io-render-ect is deprecated and will be removed in a future major. '
    + 'It cannot expose a layout contract to mikser_layouts_inspect, cannot read YAML '
    + 'frontmatter on layouts, and depends on CoffeeScript 1.x via the retired '
    + '`coffee-script` package. mikser-io-render-eta is the closest replacement — same '
    + 'embedded-code shape, and `include(\'name\', { ... })` maps directly onto ECT\'s '
    + '`include \'name\', { ... }`. Pass renderEct({ silenceDeprecation: true }) to quiet this.'

export function load({ runtime, options }) {
    const renderer = ECT({ root: options.layoutsFolder, cache: true, ext: '.ect' })
    runtime.ect = renderer.render
}

export function render({ entity, runtime }) {
    const result = runtime.ect(entity.layout.name, runtime)
    return result
}

// v9 factory — descriptor stored in `runtime.renderers` at onLoad so
// main-thread INLINE dispatch resolves through the registry. Workers
// keep using the top-level `load`/`render` exports above. ADR-0010.
export function renderEct(options = {}) {
    // Warned once at load, not per render: `load` runs for every entity, and a
    // deprecation repeated a thousand times in one build is noise nobody reads.
    //
    // `silenceDeprecation` exists because this warning reaches the build REPORT
    // as well as the terminal, and a project that has decided to stay on ect
    // for now should not have its warning count — or a CI job asserting on it —
    // broken by a notice it has already read and acted on.
    if (!options.silenceDeprecation) {
        onLoad(() => useLogger()?.warn({ code: 'deprecated-plugin', plugin: 'mikser-io-render-ect' },
                                        '%s', DEPRECATION))
    }
    return { name: options.name ?? 'ect', options, load, render, module: import.meta.url }
}
