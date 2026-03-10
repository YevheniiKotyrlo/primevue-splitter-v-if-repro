<template>
  <div style="max-width: 900px; margin: 40px auto; font-family: system-ui, sans-serif">
    <h2>Splitter v-if Panel — Layout Shift</h2>

    <p>
      Panel 2 appears after <strong>1.5 seconds</strong> (simulating async data).
      Watch the right panel — it starts at ~0px then shifts to 40%.
    </p>

    <Splitter style="height: 300px; border: 1px solid #e2e8f0; border-radius: 8px">
      <SplitterPanel :size="60" :min-size="20">
        <div style="padding: 24px">
          <h3 style="margin: 0 0 8px">Panel 1 (size=60)</h3>
          <p style="margin: 0; color: #64748b">Main content area</p>
        </div>
      </SplitterPanel>
      <SplitterPanel v-if="showSecondPanel" :size="40" :min-size="20">
        <div style="padding: 24px">
          <h3 style="margin: 0 0 8px">Panel 2 (size=40)</h3>
          <p style="margin: 0; color: #64748b">Dynamic panel — appeared after async data loaded</p>
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
