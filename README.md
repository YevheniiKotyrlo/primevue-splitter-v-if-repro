# Splitter v-if Panel — Wrong Size

Reproduction for [primefaces/primevue#XXXX](https://github.com/primefaces/primevue/issues/XXXX).

## The bug

`Splitter` only calls `initializePanels()` in `mounted()`. When a `SplitterPanel` is added via `v-if` after mount, the new panel never receives a `flexBasis` style — it renders at the wrong width instead of the configured `:size` percentage.

## Quick start

```bash
bun install
bun run dev        # Panel 2 appears after 1.5s at ~27% instead of 40%
```

To apply the fix:

```bash
bun run patch      # Apply bun patch
bun run dev        # Panel 2 now appears at the correct 40%
bun run unpatch    # Revert patch
```

## Root cause

`Splitter.vue` calls `initializePanels()` only in `mounted()`. This method queries DOM children and sets `flexBasis` from `panel.props.size`. When a panel appears via `v-if` after mount, the VNodes update (reactive) but `initializePanels()` never re-runs — the new panel has no `flexBasis` and gets sized by the browser's flex layout instead of the configured percentage.

In real-world applications with stateful Splitters (stateKey, stateStorage), the mismatch is more dramatic — the panel can start at near-zero width and then shift, causing visible layout shift.

## The fix

Add an `updated()` hook that re-initializes when the panel count changes:

```js
mounted() {
    this.initializePanels();
    this._lastPanelCount = this.panels.length;
},
updated() {
    const currentPanelCount = this.panels.length;
    if (currentPanelCount !== this._lastPanelCount) {
        this._lastPanelCount = currentPanelCount;
        this.initializePanels();
    }
},
```

The count guard ensures this does NOT reset user resize state on every re-render — only when panels are actually added or removed.

Toggle with `bun run patch` / `bun run unpatch` (uses bun's `patchedDependencies`).
