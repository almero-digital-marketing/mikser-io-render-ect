import ECT from 'ect'

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
    return { name: options.name ?? 'ect', options, load, render }
}