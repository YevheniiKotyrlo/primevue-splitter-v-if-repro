import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import App from './App.vue';

// =============================================================================
// PATCH: Uncomment the block below to fix the bug.
//
// Adds an `updated()` hook to Splitter that re-initializes panels when the
// child count changes. The count guard ensures user resize state is NOT reset
// on every re-render — only when panels are actually added or removed.
// =============================================================================

// const originalMounted = Splitter.mounted;
// Splitter.mounted = function () {
//   originalMounted.call(this);
//   this._lastPanelCount = this.panels.length;
// };
// Splitter.updated = function () {
//   const currentPanelCount = this.panels.length;
//   if (currentPanelCount !== this._lastPanelCount) {
//     this._lastPanelCount = currentPanelCount;
//     this.initializePanels();
//   }
// };

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

app.component('Splitter', Splitter);
app.component('SplitterPanel', SplitterPanel);

app.mount('#app');
