<template>
  <div style="max-width: 900px; margin: 40px auto; font-family: system-ui, sans-serif">
    <h2>Splitter v-if Panel — Wrong Size</h2>

    <p>
      Panel 2 appears after <strong>1.5 seconds</strong> (simulating async data).
      Without the patch, it renders at ~27% instead of the configured 40%.
    </p>

    <Splitter style="height: 300px; border: 1px solid #e2e8f0; border-radius: 8px">
      <SplitterPanel :size="showSecondPanel ? 60 : 100" :min-size="20">
        <div style="padding: 24px">
          <h3 style="margin: 0 0 8px">Panel 1</h3>
          <p style="margin: 0; color: #64748b">Main content area</p>
        </div>
      </SplitterPanel>
      <SplitterPanel v-if="showSecondPanel" :size="40" :min-size="20">
        <div style="padding: 24px">
          <h3 style="margin: 0 0 8px">Panel 2 (size=40)</h3>
          <p style="margin: 0; color: #64748b">Dynamic panel — loaded after async data</p>
        </div>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

const showSecondPanel = ref(false);

onMounted(() => {
  setTimeout(() => {
    showSecondPanel.value = true;
  }, 1500);
});
</script>
